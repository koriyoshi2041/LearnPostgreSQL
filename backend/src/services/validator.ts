import { ValidationRule, ValidationResult } from '../types';
import { SQLExecutor } from './sqlExecutor';

export class Validator {
  private executor: SQLExecutor;

  constructor(executor: SQLExecutor) {
    this.executor = executor;
  }

  async validate(rule: ValidationRule, userSQL: string): Promise<ValidationResult> {
    switch (rule.type) {
      case 'extension_enabled':
        return this.validateExtension(rule.params.extension);
      
      case 'table_exists':
        return this.validateTable(rule.params.table, rule.params.columns);
      
      case 'query_result':
        return this.validateQueryResult(rule.params.query, rule.params.expectedCount);
      
      case 'custom':
        return this.validateCustom(rule.params);
      
      default:
        return {
          isCorrect: false,
          message: 'Unknown validation type'
        };
    }
  }

  private async validateExtension(extensionName: string): Promise<ValidationResult> {
    const exists = await this.executor.checkExtensionEnabled(extensionName);
    
    if (exists) {
      return {
        isCorrect: true,
        message: `✅ Perfect! The ${extensionName} extension is now enabled.`
      };
    } else {
      return {
        isCorrect: false,
        message: `❌ The ${extensionName} extension is not enabled yet. Make sure you run CREATE EXTENSION "${extensionName}";`
      };
    }
  }

  private async validateTable(tableName: string, expectedColumns?: string[]): Promise<ValidationResult> {
    const exists = await this.executor.checkTableExists(tableName);
    
    if (!exists) {
      return {
        isCorrect: false,
        message: `❌ The table '${tableName}' does not exist yet. Make sure you use CREATE TABLE.`
      };
    }

    if (expectedColumns && expectedColumns.length > 0) {
      const actualColumns = await this.executor.getTableColumns(tableName);
      const missingColumns = expectedColumns.filter(col => !actualColumns.includes(col));
      
      if (missingColumns.length > 0) {
        return {
          isCorrect: false,
          message: `❌ The table '${tableName}' exists but is missing these columns: ${missingColumns.join(', ')}`,
          expected: expectedColumns,
          actual: actualColumns
        };
      }
    }

    return {
      isCorrect: true,
      message: `✅ Excellent! The '${tableName}' table has been created with all required columns.`
    };
  }

  private async validateQueryResult(query: string, expectedCount?: number): Promise<ValidationResult> {
    const result = await this.executor.execute(query);
    
    if (!result.success) {
      return {
        isCorrect: false,
        message: `❌ Validation query failed: ${result.error}`
      };
    }

    if (expectedCount !== undefined) {
      const actualCount = result.data?.length || 0;
      
      if (actualCount !== expectedCount) {
        return {
          isCorrect: false,
          message: `❌ Expected ${expectedCount} rows but found ${actualCount}.`,
          expected: expectedCount,
          actual: actualCount
        };
      }
    }

    return {
      isCorrect: true,
      message: `✅ Perfect! Your data has been inserted correctly.`
    };
  }

  private async validateCustom(params: any): Promise<ValidationResult> {
    if (params.checkType) {
      const exists = await this.executor.checkTypeExists(params.checkType);
      
      if (exists) {
        return {
          isCorrect: true,
          message: `✅ Great work! The custom type '${params.checkType}' has been created.`
        };
      } else {
        return {
          isCorrect: false,
          message: `❌ The custom type '${params.checkType}' does not exist yet.`
        };
      }
    }

    return {
      isCorrect: false,
      message: 'Unknown custom validation'
    };
  }
}

