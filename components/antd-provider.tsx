"use client";

import React from "react";
import { ConfigProvider, theme } from "antd";

interface AntdProviderProps {
  children: React.ReactNode;
}

export default function AntdProvider({ children }: AntdProviderProps) {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm, // Use dark theme to match your app
        token: {
          // Primary colors matching your Noki brand
          colorPrimary: "#1d72a6", // --noki-primary
          colorSuccess: "#10b981",
          colorWarning: "#f59e0b",
          colorError: "#ef4444",
          colorInfo: "#1d72a6",

          // Background colors
          colorBgBase: "#0a0e1a", // --background
          colorBgContainer: "#1a1f2e", // --card
          colorBgElevated: "#2a3142", // --secondary

          // Text colors
          colorTextBase: "#f8fafc", // --foreground
          colorTextSecondary: "#94a3b8", // --muted-foreground

          // Border colors
          colorBorder: "#2a3142", // --border
          colorBorderSecondary: "#2a3142",

          // Border radius
          borderRadius: 8, // --radius
          borderRadiusLG: 12,
          borderRadiusSM: 4,

          // Font family
          fontFamily:
            'var(--font-roboto), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          fontFamilyCode:
            'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',

          // Font sizes
          fontSize: 14,
          fontSizeLG: 16,
          fontSizeSM: 12,
          fontSizeXL: 20,

          // Spacing
          padding: 16,
          paddingLG: 24,
          paddingSM: 8,
          paddingXS: 4,

          // Height
          controlHeight: 40,
          controlHeightLG: 48,
          controlHeightSM: 32,

          // Box shadow
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          boxShadowSecondary: "0 2px 4px -1px rgba(0, 0, 0, 0.06)",

          // Animation
          motionDurationSlow: "0.3s",
          motionDurationMid: "0.2s",
          motionDurationFast: "0.1s",
        },
        components: {
          // Button customization
          Button: {
            borderRadius: 8,
            fontWeight: 500,
            boxShadow: "0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          },

          // Card customization
          Card: {
            borderRadius: 12,
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          },

          // Input customization
          Input: {
            borderRadius: 8,
            paddingInline: 12,
            paddingBlock: 8,
          },

          // Modal customization
          Modal: {
            borderRadius: 12,
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          },

          // Drawer customization
          Drawer: {
            borderRadius: 12,
          },

          // Table customization
          Table: {
            borderRadius: 8,
            headerBg: "#2a3142",
            rowHoverBg: "#2a3142",
          },

          // Form customization
          Form: {
            labelFontSize: 14,
            labelColor: "#f8fafc",
          },

          // Select customization
          Select: {
            borderRadius: 8,
            optionPadding: "8px 12px",
          },

          // DatePicker customization
          DatePicker: {
            borderRadius: 8,
          },

          // Tabs customization
          Tabs: {
            cardBg: "#1a1f2e",
            itemColor: "#94a3b8",
            itemActiveColor: "#1d72a6",
            itemHoverColor: "#f8fafc",
          },

          // Menu customization
          Menu: {
            itemBg: "transparent",
            itemSelectedBg: "#2a3142",
            itemHoverBg: "#2a3142",
            itemActiveBg: "#1d72a6",
            itemSelectedColor: "#f8fafc",
            itemHoverColor: "#f8fafc",
            itemColor: "#94a3b8",
          },

          // Layout customization
          Layout: {
            bodyBg: "#0a0e1a",
            headerBg: "#1a1f2e",
            siderBg: "#1a1f2e",
            footerBg: "#1a1f2e",
          },

          // Typography customization
          Typography: {
            titleMarginBottom: "0.5em",
            titleMarginTop: "1.2em",
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
