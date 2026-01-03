"use client";

import { useEffect } from "react";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import * as CookieConsent from "vanilla-cookieconsent";

export default function CookieConsentProvider() {
    useEffect(() => {
        CookieConsent.run({
            categories: {
                necessary: { enabled: true, readOnly: true },

                analytics: {
                    enabled: false,
                    services: {
                        ga: {
                            label: "Google Analytics",
                            onAccept: () => enableGA(),
                            onReject: () => {
                                disableGA();
                                // чистим cookies (примерните са за GA)
                                CookieConsent.eraseCookies(["_gid", /^_ga/]); // _ga, _ga_XXXX, etc
                            },
                            cookies: [
                                { name: "_gid" },
                                { name: /^_ga/ }, // всички започващи с _ga
                            ],
                        },
                    },
                },

                marketing: {
                    enabled: false,
                    services: {
                        meta: {
                            label: "Meta Pixel",
                            onAccept: () => enableMetaPixel(),
                            onReject: () => {
                                disableMetaPixel();
                                // Meta Pixel cookies (най-често срещани)
                                CookieConsent.eraseCookies(["_fbp", "_fbc"]);
                            },
                            cookies: [{ name: "_fbp" }, { name: "_fbc" }],
                        },
                    },
                },
            },

            language: {
                default: "bg",
                translations: {
                    bg: {
                        consentModal: {
                            title: "Ние използваме бисквитки",
                            description:
                                `Използваме бисквитки за правилна работа на сайта, статистика (Google Analytics) и маркетинг (Meta Pixel). ` +
                                `Повече информация: <a href="/cookies" target="_self">Политика за бисквитки</a> и ` +
                                `<a href="/privacy" target="_self">Политика за поверителност</a>.`,
                            acceptAllBtn: "Приемам всички",
                            acceptNecessaryBtn: "Отказвам",
                            showPreferencesBtn: "Настройки",
                        },
                        preferencesModal: {
                            title: "Настройки на бисквитките",
                            acceptAllBtn: "Приемам всички",
                            acceptNecessaryBtn: "Отказвам всички",
                            savePreferencesBtn: "Запази настройките",
                            closeIconLabel: "Затвори",
                            sections: [
                                {
                                    title: "Задължителни",
                                    description: "Нужни за работа на сайта.",
                                    linkedCategory: "necessary",
                                },
                                {
                                    title: "Аналитични (Google Analytics)",
                                    description: "Помагат ни да подобрим сайта.",
                                    linkedCategory: "analytics",
                                },
                                {
                                    title: "Маркетингови (Meta Pixel)",
                                    description: "За реклами във Facebook/Instagram.",
                                    linkedCategory: "marketing",
                                },
                                {
                                    title: "Повече информация",
                                    description:
                                        `Прочетете <a href="/cookies" target="_self">Политика за бисквитки</a> и ` +
                                        `<a href="/privacy" target="_self">Политика за поверителност</a>.`,
                                }
                            ],
                        },
                    },
                },
            },
            // При всяко зареждане/действие — синхронизация (ако предпочиташ централизирано)
            onConsent: () => syncFromConsent(),
            onChange: () => syncFromConsent(),
        });

        // ако вече има избор от преди
        syncFromConsent();
    }, []);

    return null;
}

function syncFromConsent() {
    // ако някой е махнал consent от UI, onReject ще се извика автоматично за service-а,
    // но това е extra safety
    if (!CookieConsent.acceptedCategory("analytics")) {
        disableGA();
    }
    if (!CookieConsent.acceptedCategory("marketing")) {
        disableMetaPixel();
    }
}

/** === GA === */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

function enableGA() {
    if (!GA_ID) return;
    if ((window as any).__ga_loaded) return;
    (window as any).__ga_loaded = true;

    const s1 = document.createElement("script");
    s1.async = true;
    s1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(s1);

    const s2 = document.createElement("script");
    s2.id = "ga-inline";
    s2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_ID}', { anonymize_ip: true });
  `;
    document.head.appendChild(s2);
}

function disableGA() {
    // Не можем “да изкараме” вече изпратени хитове, но можем:
    // 1) да спрем бъдещи
    // 2) да изтрием cookies
    (window as any).__ga_loaded = false;

    // ако gtag съществува, можем да сложим opt-out флаг
    // (GA4 уважава този флаг за измерването на страницата в повечето случаи)
    (window as any)[`ga-disable-${GA_ID}`] = true;

    // optional: махаме inline скрипта (не е задължително)
    document.getElementById("ga-inline")?.remove();
}

/** === Meta Pixel === */
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
function enableMetaPixel() {
    if (!META_PIXEL_ID) return;
    if ((window as any).__meta_loaded) return;
    (window as any).__meta_loaded = true;

    const w = window as any;

    // fbq stub (queue)
    if (!w.fbq) {
        const fbq = function (...args: any[]) {
            (fbq as any).callMethod
                ? (fbq as any).callMethod.apply(fbq, args)
                : (fbq as any).queue.push(args);
        };
        (fbq as any).queue = [];
        (fbq as any).version = "2.0";
        (fbq as any).loaded = false;
        w.fbq = fbq;
        w._fbq = fbq;
    }

    // ✅ default: revoke (няма cookies)
    w.fbq("consent", "revoke"); // :contentReference[oaicite:4]{index=4}

    // load external script
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://connect.facebook.net/en_US/fbevents.js";
    s.onload = () => {
        // ✅ след като имаме marketing consent -> grant
        w.fbq("consent", "grant"); // :contentReference[oaicite:5]{index=5}
        w.fbq("init", META_PIXEL_ID);
        w.fbq("track", "PageView");

        // fallback: ако Meta не сетне _fbp, ние го гарантираме
        ensureFbpCookie();
        ensureFbcCookieFromFbclid();
    };
    document.head.appendChild(s);
}

function disableMetaPixel() {
    const w = window as any;
    try {
        if (typeof w.fbq === "function") {
            w.fbq("consent", "revoke"); // :contentReference[oaicite:6]{index=6}
        }
    } catch { }

    CookieConsent.eraseCookies(["_fbp", "_fbc"]);
    (window as any).__meta_loaded = false;
}

function setCookie(name: string, value: string, days = 90) {
    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
}

function getCookie(name: string) {
    const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return m ? decodeURIComponent(m[1]) : null;
}

function ensureFbpCookie() {
    if (getCookie("_fbp")) return;
    const ts = Date.now();
    const rnd = Math.floor(Math.random() * 1e10);
    setCookie("_fbp", `fb.1.${ts}.${rnd}`, 90);
}

function ensureFbcCookieFromFbclid() {
    const fbclid = new URL(window.location.href).searchParams.get("fbclid");
    if (!fbclid) return; // нормално да е празно
    if (getCookie("_fbc")) return;
    const ts = Date.now();
    setCookie("_fbc", `fb.1.${ts}.${fbclid}`, 90);
}
