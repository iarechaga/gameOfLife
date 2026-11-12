import type { ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';

export interface MountedTestRoot {
  container: HTMLDivElement;
  rerender: (element: ReactNode) => Promise<void>;
  click: (el: Element | null, label?: string) => Promise<void>;
  changeValue: (
    el: HTMLInputElement | HTMLSelectElement | null,
    nextValue: string,
    label?: string,
  ) => Promise<void>;
  dispatchWindowKey: (key: string, target?: HTMLElement) => Promise<void>;
  waitEffects: (ms?: number) => Promise<void>;
  unmount: () => Promise<void>;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mountForTest(initialElement: ReactNode): Promise<MountedTestRoot> {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  flushSync(() => {
    root.render(initialElement);
  });
  await sleep(20);

  let unmounted = false;

  return {
    container,
    async rerender(element: ReactNode) {
      flushSync(() => {
        root.render(element);
      });
      await sleep(20);
    },
    async click(el: Element | null, label = 'elemento') {
      if (!el || !(el instanceof HTMLElement)) {
        throw new Error(`No se encontró ${label} en el DOM renderizado.`);
      }
      if (el instanceof HTMLButtonElement && el.disabled) {
        throw new Error(`Se intentó hacer click en ${label}, pero está disabled.`);
      }
      flushSync(() => {
        el.click();
      });
      await sleep(15);
    },
    async changeValue(el, nextValue, label = 'campo') {
      if (!el) {
        throw new Error(`No se encontró ${label} en el DOM renderizado.`);
      }
      const proto =
        el instanceof HTMLSelectElement
          ? window.HTMLSelectElement.prototype
          : window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(proto, 'value');
      descriptor?.set?.call(el, nextValue);
      flushSync(() => {
        el.dispatchEvent(new Event('change', { bubbles: true }));
        el.dispatchEvent(new Event('input', { bubbles: true }));
      });
      await sleep(15);
    },
    async dispatchWindowKey(key: string, target?: HTMLElement) {
      const eventTarget = target ?? window;
      flushSync(() => {
        eventTarget.dispatchEvent(
          new KeyboardEvent('keydown', { key, code: key, bubbles: true, cancelable: true }),
        );
      });
      await sleep(15);
    },
    async waitEffects(ms = 25) {
      await sleep(ms);
    },
    async unmount() {
      if (unmounted) return;
      unmounted = true;
      flushSync(() => {
        root.unmount();
      });
      container.remove();
      await sleep(10);
    },
  };
}

export function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

export function assertEqual<T>(actual: T, expected: T, label: string): void {
  if (!Object.is(actual, expected)) {
    throw new Error(
      `${label}: se esperaba ${JSON.stringify(expected)}, pero se recibió ${JSON.stringify(actual)}.`,
    );
  }
}

export function assertThrows(fn: () => unknown, label: string): void {
  let threw = false;
  try {
    fn();
  } catch {
    threw = true;
  }
  if (!threw) {
    throw new Error(`${label}: debía lanzar un Error, pero terminó sin lanzar nada.`);
  }
}
