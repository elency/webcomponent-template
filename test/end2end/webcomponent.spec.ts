import { Assert, TestResult, test } from "zora";
import { ElementHandle, Page, chromium } from "playwright-chromium";
import { Server, createServer } from "http";

import { WebcomponentTemplateElement } from "../../src/web-component";
import finalHandler from "finalhandler";
import serveStatic from "serve-static";

// SETTINGS
const HOST = "localhost";
const PORT = 8080;
const SELECTOR = "css:light=webcomponent-template";

// TESTS
interface Test {
    description: string;
    script: (t: Assert, description: string, page: Page) => Promise<void>;
}
const testList: Test[] = [];

// focus
testList.push({
    description: "focus empty element should focus first empty field",
    script: async (t, description, page) => {
        // context
        // action
        await page.focus(SELECTOR);
        // check result
        t.ok(
            await page.$eval(
                SELECTOR,
                (webcomponent: WebcomponentTemplateElement) => {
                    const firstChar = Array.from(
                        webcomponent.shadowRoot!.querySelectorAll(
                            "[data-type=char]"
                        )
                    ).shift();
                    const selectedChar = webcomponent.shadowRoot!.activeElement;
                    return firstChar === selectedChar;
                }
            ),
            "first char should be selected"
        );
    },
});
// FIXME: uncomment once following ticket is solved https://github.com/microsoft/playwright/issues/2510
// testList.push({
//     description:
//         "focus on custom element (partially filled) should focus first empty field",
//     script: async (t, description, page) => {
//         // context
//         await page.type(SELECTOR, "123");
//         await page.press(SELECTOR, "ArrowLeft");
//         await page.press(SELECTOR, "ArrowLeft");
//         await page.press(SELECTOR, "Backspace");
//         await page.press(SELECTOR, "End");
//         await page.$eval(SELECTOR, (webcomponent: WebcomponentTemplateElement) => {
//             webcomponent.blur();
//         });
//         // action
//         await page.focus(SELECTOR);
//         await page.screenshot({
//             path: `screenshot/${description}.png`,
//         });
//         // check result
//         t.ok(
//             await page.$eval(SELECTOR, (webcomponent: WebcomponentTemplateElement) => {
//                 const secondChar = webcomponent.shadowRoot!.querySelectorAll(
//                     "[data-type=char]"
//                 )[1];
//                 const selectedChar = webcomponent.shadowRoot!.activeElement;
//                 return secondChar === selectedChar;
//             }),
//             "second char should be selected"
//         );
//     },
// });
testList.push({
    description:
        "focus on custom element (fully filled) should focus first char",
    script: async (t, description, page) => {
        // context
        await page.$eval(
            SELECTOR,
            (webcomponent: WebcomponentTemplateElement) => {
                webcomponent.value = "abcdef";
            }
        );
        // action
        await page.focus(SELECTOR);
        // check result
        t.ok(
            await page.$eval(
                SELECTOR,
                (webcomponent: WebcomponentTemplateElement) => {
                    const firstChar = Array.from(
                        webcomponent.shadowRoot!.querySelectorAll(
                            "[data-type=char]"
                        )
                    ).shift();
                    const selectedChar = webcomponent.shadowRoot!.activeElement;
                    return firstChar === selectedChar;
                }
            ),
            "first char should be selected"
        );
    },
});

// navigation
testList.push({
    description: "[End] key should focus last char",
    script: async (t, description, page) => {
        // context
        await page.press(SELECTOR, "Home");
        // action
        await page.press(SELECTOR, "End");
        // check result
        t.ok(
            await page.$eval(
                SELECTOR,
                (webcomponent: WebcomponentTemplateElement) => {
                    const lastChar = Array.from(
                        webcomponent.shadowRoot!.querySelectorAll(
                            "[data-type=char]"
                        )
                    ).pop();
                    const selectedChar = webcomponent.shadowRoot!.activeElement;
                    return lastChar === selectedChar;
                }
            ),
            "last char should be selected"
        );
    },
});
testList.push({
    description: "[Control]+[ArrowRight] key should focus last char",
    script: async (t, description, page) => {
        // context
        await page.press(SELECTOR, "Home");
        // action
        await page.press(SELECTOR, "Control+ArrowRight");
        // check result
        t.ok(
            await page.$eval(
                SELECTOR,
                (webcomponent: WebcomponentTemplateElement) => {
                    const lastChar = Array.from(
                        webcomponent.shadowRoot!.querySelectorAll(
                            "[data-type=char]"
                        )
                    ).pop();
                    const selectedChar = webcomponent.shadowRoot!.activeElement;
                    return lastChar === selectedChar;
                }
            ),
            "last char should be selected"
        );
    },
});
testList.push({
    description: "[Home] key should focus first char",
    script: async (t, description, page) => {
        // context
        await page.press(SELECTOR, "End");
        // action
        await page.press(SELECTOR, "Home");
        // check result
        t.ok(
            await page.$eval(
                SELECTOR,
                (webcomponent: WebcomponentTemplateElement) => {
                    const firstChar = Array.from(
                        webcomponent.shadowRoot!.querySelectorAll(
                            "[data-type=char]"
                        )
                    ).shift();
                    const selectedChar = webcomponent.shadowRoot!.activeElement;
                    return firstChar === selectedChar;
                }
            ),
            "first char should be selected"
        );
    },
});
testList.push({
    description: "[Control]+[ArrowLeft] key should focus first char",
    script: async (t, description, page) => {
        // context
        await page.press(SELECTOR, "End");
        // action
        await page.press(SELECTOR, "Control+ArrowLeft");
        // check result
        t.ok(
            await page.$eval(
                SELECTOR,
                (webcomponent: WebcomponentTemplateElement) => {
                    const firstChar = Array.from(
                        webcomponent.shadowRoot!.querySelectorAll(
                            "[data-type=char]"
                        )
                    ).shift();
                    const selectedChar = webcomponent.shadowRoot!.activeElement;
                    return firstChar === selectedChar;
                }
            ),
            "first char should be selected"
        );
    },
});
testList.push({
    description: "[ArrowLeft] key should focus previous char",
    script: async (t, description, page) => {
        // context
        await page.press(SELECTOR, "End");
        // action
        await page.press(SELECTOR, "ArrowLeft");
        // check result
        t.ok(
            await page.$eval(
                SELECTOR,
                (webcomponent: WebcomponentTemplateElement) => {
                    const charList = Array.from(
                        webcomponent.shadowRoot!.querySelectorAll(
                            "[data-type=char]"
                        )
                    );
                    const penultimateChar = charList[charList.length - 2];
                    const selectedChar = webcomponent.shadowRoot!.activeElement;
                    return penultimateChar === selectedChar;
                }
            ),
            "penultimate char should be selected"
        );
    },
});
testList.push({
    description: "[ArrowRight] key should focus next char",
    script: async (t, description, page) => {
        // context
        await page.press(SELECTOR, "Home");
        // action
        await page.press(SELECTOR, "ArrowRight");
        // check result
        t.ok(
            await page.$eval(
                SELECTOR,
                (webcomponent: WebcomponentTemplateElement) => {
                    const charList = Array.from(
                        webcomponent.shadowRoot!.querySelectorAll(
                            "[data-type=char]"
                        )
                    );
                    const secondChar = charList[1];
                    const selectedChar = webcomponent.shadowRoot!.activeElement;
                    return secondChar === selectedChar;
                }
            ),
            "second char should be selected"
        );
    },
});

// content
// TODO: uncomment once synchronious clipboard support allow to trigger paste event https://caniuse.com/#search=clipboard
// or change if playwright offer a trigger for clipboard event https://github.com/microsoft/playwright/issues/2511
// testList.push({
//     description: "paste should replace full value",
//     script: async (t, description, page) => {
//         // context
//         const clipboardText = "123456";
//         await page.$eval(SELECTOR, (webcomponent: WebcomponentTemplateElement) => {
//             webcomponent.value = "abcdef";
//         });
//         await page.focus(SELECTOR);
//         await page.press(SELECTOR, "ArrowRight");
//         // action
//         await page.evaluate(async (text) => {
//             await navigator.clipboard.writeText(text);
//             // document.execCommand("paste");
//         }, clipboardText);
//         // check result
//         t.ok(
//             await page.$eval(SELECTOR, (webcomponent: WebcomponentTemplateElement) => {
//                 return webcomponent.value === "123456";
//             }),
//             "value should be replaced char should be selected"
//         );
//     },
// });
testList.push({
    description: "write content should update value",
    script: async (t, description, page) => {
        // context
        const value = "123456";
        // action
        await page.type(SELECTOR, value);
        // check result
        t.equal(
            await page.$eval(
                SELECTOR,
                (webcomponent: WebcomponentTemplateElement) => {
                    return webcomponent.value;
                }
            ),
            value,
            "value should be updated"
        );
    },
});
testList.push({
    description: "write new content should overwrite value",
    script: async (t, description, page) => {
        // context
        const component = (await page.$(
            SELECTOR
        )) as ElementHandle<WebcomponentTemplateElement>;
        await component.type("abcdef");
        // action
        const value = "123456";
        await component.press("Home");
        await component.type(value);
        // check result
        t.equal(
            await component.evaluate((component) => component.value),
            value,
            "value should be updated"
        );
    },
});
testList.push({
    description: "[Backspace] should erase previous content",
    script: async (t, description, page) => {
        // context
        const component = (await page.$(
            SELECTOR
        )) as ElementHandle<WebcomponentTemplateElement>;
        await component.type("abcdef");
        await component.press("End");
        // action
        await component.press("Backspace");
        // check result
        t.equal(
            await component.evaluate((component) => component.value),
            "abcde",
            "value should be truncated"
        );
        // action
        await component.press("Backspace");
        await component.press("Backspace");
        await component.press("Backspace");
        await component.press("Backspace");
        await component.press("Backspace");
        // check result
        t.equal(
            await component.evaluate((component) => component.value),
            "",
            "value should be empty string"
        );
    },
});
testList.push({
    description: "[Delete] should erase next content",
    script: async (t, description, page) => {
        // context
        const component = (await page.$(
            SELECTOR
        )) as ElementHandle<WebcomponentTemplateElement>;
        await component.type("abcdef");
        await component.press("Home");
        // action
        await component.press("Delete");
        // check result
        t.equal(
            await component.evaluate((component) => component.value),
            "bcdef",
            "value should be truncated"
        );
        // action
        await component.press("Delete");
        await component.press("Delete");
        await component.press("Delete");
        await component.press("Delete");
        await component.press("Delete");
        // check result
        t.equal(
            await component.evaluate((component) => component.value),
            "",
            "value should be empty string"
        );
    },
});

// START TEST
test("webcomponent", async (t) => {
    // SHARED VAR
    const parallelTests: Promise<TestResult>[] = [];

    // START BROWSER
    const options =
        process.env.HEADFULL === "true"
            ? { headless: false, slowMo: 50 }
            : undefined;
    const browser = await chromium.launch(options);
    const context = await browser.newContext();
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);

    // START HTTP SERVER
    var serve = serveStatic("build", {
        index: ["index.html", "index.htm"],
    });
    const server = createServer(function onRequest(req, res) {
        const done = finalHandler(req, res);
        serve(req /*as any*/, res /*as any*/, done as () => void);
    });
    server.listen(PORT);

    // RUN TESTS
    await Promise.all(
        testList.map(async ({ description, script }) => {
            // create a page for test
            const page = await context.newPage();
            await page.goto(`${HOST}:${PORT}`);
            await page.$eval(
                "css:light=body",
                (bodyElement: HTMLBodyElement, { description }) => {
                    const h1 = document.createElement("h1");
                    h1.textContent = description;
                    bodyElement.insertBefore(h1, bodyElement.firstElementChild);
                },
                { description: description }
            );
            try {
                // run script
                await t.test(description, async (t) => {
                    return script(t, description, page);
                });

                if (process.env.CI !== "true")
                    // create screenshot on local environment
                    await page.screenshot({
                        path: `screenshot/${description}.png`,
                    });
            } finally {
                // close page of test
                await page.close();
            }
        })
    );

    // AFTER ALL
    await t.test("Release:", (t) => {
        const parallelTests: Promise<TestResult>[] = [];
        // stop  browser engines
        t.test(`stop browser`, async (t) => {
            await browser.close();
            t.ok(true);
        });

        // close http server
        // wotan-disable-next-line await-async-result
        t.test("close http server", (t) => {
            server.close();
            t.ok(true);
        });
    });
});
