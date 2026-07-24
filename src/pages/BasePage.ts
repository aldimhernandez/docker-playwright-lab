import { expect, Page } from '@playwright/test';

export class BasePage {

    readonly url: string = '/';

    constructor(public readonly page: Page) {
    }

    async goto() {
        await this.page.goto(this.url);
    }

    async waitForURL(url: string) {
        await this.page.waitForURL(url);
    }

    async validateURL() {
        await expect(this.page).toHaveURL(new RegExp(this.url));
    }

    async validateTitle(title: string) {
        await expect(this.page).toHaveTitle(new RegExp(title));
    }

    async getElementByText(text: string) {
        await this.page.getByRole('link', { name: text }).click();
    }
}
