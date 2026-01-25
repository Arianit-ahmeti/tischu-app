import { expect, test } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

const testuser_email = process.env.TEST_USER_EMAIL;
const testuser_password = process.env.TEST_USER_PASSWORD;

test("should correctly login with testuser", async ({ page }) => {
  await page.goto("Auth/");

  await page.waitForTimeout(3000);

  const initialUrl = page.url();

  const emailTextInput = page.getByTestId("auth/email-input");
  await emailTextInput.fill(testuser_email);

  const passwordTextInput = page.getByTestId("auth/password-input");
  await passwordTextInput.fill(testuser_password);

  const signInButton = page.getByTestId("auth/sign-in-button");
  await signInButton.click();

  // After successful login we should be redirected away from the login page
  await page.waitForTimeout(3000);
  const currentUrl = page.url();
  expect(currentUrl).not.toBe(initialUrl);
});

test("login should fail with wrong credentials", async ({ page }) => {
  await page.goto("Auth/");

  await page.waitForTimeout(3000);

  const initialUrl = page.url();

  const emailTextInput = page.getByTestId("auth/email-input");
  await emailTextInput.fill("wrong@email.com");

  const passwordTextInput = page.getByTestId("auth/password-input");
  await passwordTextInput.fill("wrongpassword");

  const signInButton = page.getByTestId("auth/sign-in-button");
  await signInButton.click();

  // After unsuccessful login we should not be redirected away from the login page
  await page.waitForTimeout(3000);
  const currentUrl = page.url();
  expect(currentUrl).toBe(initialUrl);
});

test("should be able to sign up a new user", async ({ page }) => {
  await page.goto("Auth/");

  await page.waitForTimeout(3000);

  const initialUrl = page.url();

  const emailTextInput = page.getByTestId("auth/email-input");
  const newUserEmail = "test" + Date.now() + "@testuser.com";
  await emailTextInput.fill(newUserEmail);
  const passwordTextInput = page.getByTestId("auth/password-input");
  await passwordTextInput.fill("testpassword");

  const signUpButton = page.getByTestId("auth/sign-up-button");
  await signUpButton.click();

  await page.waitForTimeout(3000);

  // After sign up we should be redirected away from the login page
  const currentUrl = page.url();
  expect(currentUrl).not.toBe(initialUrl);
});
