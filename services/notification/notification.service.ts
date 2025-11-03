"use client";

import { notification } from "antd";

export interface NotificationConfig {
  type: "success" | "error" | "info" | "warning";
  title: string;
  description?: string;
  duration?: number;
}

class NotificationService {
  private static instance: NotificationService;

  private constructor() {
    // Configure notification defaults
    notification.config({
      placement: "top",
      top: 24,
      duration: 4.5,
      rtl: false,
    });
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public show(config: NotificationConfig): void {
    const { type, title, description, duration = 4.5 } = config;

    notification[type]({
      message: title,
      description,
      duration,
      // Style will be handled by Ant Design provider configuration
      className: "ant-notification-custom",
    });
  }

  public success(title: string, description?: string, duration?: number): void {
    this.show({ type: "success", title, description, duration });
  }

  public error(title: string, description?: string, duration?: number): void {
    this.show({ type: "error", title, description, duration });
  }

  public info(title: string, description?: string, duration?: number): void {
    this.show({ type: "info", title, description, duration });
  }

  public warning(title: string, description?: string, duration?: number): void {
    this.show({ type: "warning", title, description, duration });
  }

  public destroy(): void {
    notification.destroy();
  }
}

export const notificationService = NotificationService.getInstance();
