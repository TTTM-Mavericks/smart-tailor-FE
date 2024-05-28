interface ValidationResult {
    isValid: boolean;
    error?: string;
  }
  
  /**
   * Email Validator
   * @param email 
   * @returns 
   */
  export const __validateEmail = (email: string): ValidationResult => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    // Check if the password is provided
    if (!email) {
      return {
        isValid: false,
        error: 'Email is required.',
      };
    }
  
    if (!emailRegex.test(email)) {
      return {
        isValid: false,
        error: 'Invalid email format.',
      };
    }
  
    return {
      isValid: true,
    };
  }
  
  /**
   * Email Validator
   * @param email 
   * @returns 
   */
  export const __validateUsername = (username: string): ValidationResult => {
    const usernameRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!username) {
      return {
        isValid: false,
        error: 'Username is required.',
      };
    }
  
    if (!usernameRegex.test(username)) {
      return {
        isValid: false,
        error: 'Username must be only charaties.',
      };
    }
  
    return {
      isValid: true,
    };
  }
  
  /**
   * String Validator
   * @param string 
   * @returns 
   */
  export const __validateString = (string: string): ValidationResult => {
    const stringRegex = /^[a-zA-Z0-9\u0102\u0103\u0110\u0111\u0128\u0129\u0168\u0169\u01A0\u01A1\u01AF\u01B0\u1EA0-\u1EF9\s!@#$%^&*()-_=+{}[]|;:'",.<>?`~]*$/;
  
    if (!string) {
      return {
        isValid: false,
        error: 'Username is required.',
      };
    }
  
    if (!stringRegex.test(string)) {
      return {
        isValid: false,
        error: 'String must 8-20 characties and not have special characties.',
      };
    }
  
    return {
      isValid: true,
    };
  }
  
  /**
   * Password validator
   * @param password 
   * @returns 
   */
  export const __validatePassword = (password: string): ValidationResult => {
    // Check if the password is provided
    if (!password) {
      return {
        isValid: false,
        error: 'Password is required.',
      };
    }
  
    // Define individual conditions for password validation
    const isLengthValid = password.length >= 8;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password);
  
    // Check each condition and return corresponding error messages
    if (!isLengthValid) {
      return {
        isValid: false,
        error: 'Password must be at least 8 characters long.',
      };
    }
  
    if (!hasLowercase) {
      return {
        isValid: false,
        error: 'Password must include at least one lowercase letter.',
      };
    }
  
    if (!hasUppercase) {
      return {
        isValid: false,
        error: 'Password must include at least one uppercase letter.',
      };
    }
  
    if (!hasDigit) {
      return {
        isValid: false,
        error: 'Password must include at least one digit.',
      };
    }
  
    if (!hasSpecialChar) {
      return {
        isValid: false,
        error: 'Password must include at least one special character.',
      };
    }
  
    // Password is valid
    return {
      isValid: true,
    };
  };
  
  export function __convertDateFormat(inputDate: any) {
    const birthday = new Date(inputDate);
    const year = birthday.getFullYear();
    const month = (birthday.getMonth() + 1).toString().padStart(2, '0');
    const day = birthday.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  export function __formatDate(inputDateString: string): string {
    try {
      if (!inputDateString) {
        throw new Error('Input date string is empty or undefined');
      }
  
      const dateObj = new Date(inputDateString);
  
      if (isNaN(dateObj.getTime())) {
        throw new Error('Invalid date string');
      }
  
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
      const day = String(dateObj.getDate()).padStart(2, '0'); // Add leading zero if needed
  
      return `${year}-${month}-${day}`;
    } catch (error: any) {
      console.error(error.message);
      throw error; // Re-throw the error for further handling
    }
  }
  
  export function __parseDateString(inputDateString: any): Date {
    // Split the input string into year, month, and day components
    const [year, month, day] = inputDateString.split('-').map(Number);
  
    // Create a Date object with the components
    return new Date(year, month - 1, day); // Note: Months are zero-based in JavaScript Dates
  }