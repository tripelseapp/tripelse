import { UserEntity } from 'user/entities/user.entity';

const isXCharsLong = (password: string, x: number): boolean => {
  return password.length >= x;
};

const containsUppercase = (password: string): boolean => {
  return /[A-Z]/.test(password);
};

const containsLowercase = (password: string): boolean => {
  return /[a-z]/.test(password);
};

const containsNumber = (password: string): boolean => {
  return /\d/.test(password);
};

const containsSpecialCharacter = (password: string): boolean => {
  return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
};

export const passwordStrongEnough = (
  password: UserEntity['password'],
): {
  strongEnough: boolean;
  reason?: string[];
} => {
  const checks = [
    {
      check: isXCharsLong(password, 8),
      reason: 'Password must be at least 8 characters long',
    },
    {
      check: containsUppercase(password),
      reason: 'Password must contain at least one uppercase letter',
    },
    {
      check: containsLowercase(password),
      reason: 'Password must contain at least one lowercase letter',
    },
    {
      check: containsNumber(password),
      reason: 'Password must contain at least one number',
    },
    {
      check: containsSpecialCharacter(password),
      reason: 'Password must contain at least one special character',
    },
  ];

  const failedCheck = checks.find((check) => !check.check);

  if (failedCheck) {
    return {
      strongEnough: false,
      reason: [failedCheck.reason],
    };
  }

  return {
    strongEnough: true,
  };
};
