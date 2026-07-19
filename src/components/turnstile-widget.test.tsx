import { act, cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { TurnstileWidget } from "./turnstile-widget";

afterEach(() => cleanup());

describe("TurnstileWidget", () => {
  it("carica lo script, configura l'action e rimuove il widget allo smontaggio", async () => {
    type WidgetOptions = {
      callback: (token: string) => void;
      "error-callback": () => void;
      "expired-callback": () => void;
    } & Record<string, unknown>;

    const onVerify = vi.fn();
    const onExpire = vi.fn();
    const onError = vi.fn();
    const remove = vi.fn();
    const renderWidget = vi.fn((_container: HTMLElement, _options: WidgetOptions) => "widget-id");

    const view = render(
      <TurnstileWidget
        siteKey="test-site-key"
        onVerify={onVerify}
        onExpire={onExpire}
        onError={onError}
      />,
    );

    const script = document.querySelector<HTMLScriptElement>("#cloudflare-turnstile-script");
    expect(script?.src).toContain("api.js?render=explicit");

    window.turnstile = { render: renderWidget, remove };
    await act(async () => script?.dispatchEvent(new Event("load")));

    expect(renderWidget).toHaveBeenCalledOnce();
    const options = renderWidget.mock.calls[0]?.[1];
    expect(options).toMatchObject({
      sitekey: "test-site-key",
      action: "turnstile-spin-v2",
      appearance: "interaction-only",
      theme: "auto",
      size: "flexible",
    });

    act(() => options?.callback("valid-token"));
    expect(onVerify).toHaveBeenCalledWith("valid-token");

    act(() => options?.["expired-callback"]());
    act(() => options?.["error-callback"]());
    expect(onExpire).toHaveBeenCalledOnce();
    expect(onError).toHaveBeenCalledOnce();

    view.unmount();
    expect(remove).toHaveBeenCalledWith("widget-id");
  });
});
