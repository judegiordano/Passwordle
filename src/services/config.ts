import { UAParser } from "ua-parser-js";

const parser = new UAParser();

export const NEXT_PUBLIC_RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";
export const RECAPTCHA_SITE_SECRET = process.env.RECAPTCHA_SITE_SECRET ?? "";
export const NEXT_PUBLIC_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? "http://localhost:3000";
export const MAX_TRIES = 10;
export const PASSWORD_LENGTH = 10;
export const BROWSER = parser.getBrowser();
export const DEVICE = parser.getDevice();
export const WEB_SHARE_API_DEVICE_TYPES = ["console", "mobile", "tablet", "smarttv", "wearable", "embedded"];
