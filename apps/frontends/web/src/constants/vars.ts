const getEnv = (key: string): string => {
	const value = process.env[key] || process.env[`NEXT_PUBLIC_${key}`];
	if (value === undefined) {
		throw new Error(
			`Configuration error - missing environment variable: ${key}`,
		);
	}

	return value;
};

interface Config {
	api: {
		client: string;
		server: string;
	};
	token: {
		access_name: string;
	};
}

const vars: Config = Object.freeze({
	api: {
		client: getEnv("NEXT_PUBLIC_CLIENT_API_URL"),
		server: getEnv("NEXT_PUBLIC_SERVER_API_URL"),
	},

	token: {
		access_name: getEnv("NEXT_PUBLIC_ACCESS_TOKEN_COOKIE_NAME"),
	},
});

export default vars;
