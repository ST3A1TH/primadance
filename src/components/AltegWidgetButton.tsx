import { useEffect } from "react";

declare global {
  interface Window {
    yWidget?: { setButtons?: () => void };
    yWidgetSettings?: {
      buttonAutoShow?: boolean;
      showNewWidgetAutomatically?: boolean;
      buttonText?: string;
    };
  }
}

type AltegWidgetButtonProps = {
  children: React.ReactNode;
  className?: string;
};

const ALTEG_SCRIPT_ID = "alteg-widget-script";
const ALTEG_WIDGET_URL = "https://n1420624.alteg.io/";

const AltegWidgetButton = ({ children, className }: AltegWidgetButtonProps) => {
  useEffect(() => {
    window.yWidgetSettings = {
      ...window.yWidgetSettings,
      buttonAutoShow: false,
      showNewWidgetAutomatically: false,
    };

    const bindWidgetButton = () => window.yWidget?.setButtons?.();
    const existingScript = document.getElementById(ALTEG_SCRIPT_ID) as HTMLScriptElement | null;

    if (existingScript) {
      bindWidgetButton();
      return;
    }

    const script = document.createElement("script");
    script.id = ALTEG_SCRIPT_ID;
    script.src = "https://w1420624.alteg.io/widgetJS";
    script.type = "text/javascript";
    script.charset = "UTF-8";
    script.async = true;
    script.onload = bindWidgetButton;
    document.body.appendChild(script);
  }, []);

  return (
    <a href={ALTEG_WIDGET_URL} data-url={ALTEG_WIDGET_URL} className={`ms-button ${className ?? ""}`}>
      {children}
    </a>
  );
};

export default AltegWidgetButton;