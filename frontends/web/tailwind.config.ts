import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import { poluiPlugin } from "pol-ui";
export default {
  content: ["./src/**/*.tsx", "node_modules/pol-ui/lib/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [poluiPlugin()],
} satisfies Config;
