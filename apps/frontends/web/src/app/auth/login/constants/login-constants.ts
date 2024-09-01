import { InputProps } from "pol-ui";

type LoginConstants = {
  params: {
    user: string;
  };
  identification: {
    userOrEmail: {
      name: string;
      labelKey: string;
      validations: InputProps;
    };
  };
};

export const loginConstants: LoginConstants = {
  params: {
    user: "u",
  },
  identification: {
    userOrEmail: {
      name: "usernameOrEmail",
      labelKey: "usernameOrEmail",
      validations: {
        placeholder: "Pep Sanchis",
        minLength: 4,
        maxLength: 30,
        autoComplete: "off",
        required: true,
      },
    },
  },
};
