"use client";

import React, { createContext, useContext, useState } from "react";

const translations = {
  en: {
    nav: {
      home: "HOME",
      features: "FEATURES",
      pricing: "PRICING",
      about: "ABOUT",
      login: "LOGIN",
      getStarted: "GET STARTED",
    },
    hero: {
      headline1: "Turn Your Restaurant Into a",
      headline2: "Smart",
      headline3: "QR Ordering System",
      subtext:
        "Manage menu, orders, and customers in real-time — no app needed. Enhance guest experience and increase efficiency instantly.",
      cta1: "Get Started Free",
      cta2: "View Demo",
      orderBadge: "New Order",
      orderDetail: "Table 12 • $42.50",
    },
    features: {
      label: "Features",
      heading: "Everything you need to run a modern restaurant",
      subtext:
        "Stop waiting for apps. Give your customers the freedom to order exactly when they're ready.",
      items: [
        {
          title: "Real-time Dashboard",
          description:
            "Manage orders instantly with a live kitchen display system that updates in real-time.",
        },
        {
          title: "QR Code Ordering",
          description:
            "Custom QR codes for every table. No app download required for your customers.",
        },
        {
          title: "Menu Management",
          description:
            "Update your menu in seconds. Change prices, items, and categories instantly.",
        },
        {
          title: "Food Photography",
          description:
            "High-quality image uploads to showcase your dishes and increase order value.",
        },
        {
          title: "Multi-Store Support",
          description:
            "Manage multiple restaurant locations from a single master dashboard account.",
        },
        {
          title: "Live Status Updates",
          description:
            "Automated notifications for staff and customers about order progress.",
        },
      ],
    },
    steps: {
      label: "Process",
      heading: "Three steps to a smarter kitchen",
      items: [
        {
          title: "Create Restaurant",
          description: "Sign up and set up your restaurant profile in minutes.",
        },
        {
          title: "Generate QR",
          description: "Design and print your custom QR codes for each table.",
        },
        {
          title: "Get Orders",
          description: "Receive and manage customer orders in real-time.",
        },
      ],
    },
    pricing: {
      label: "Pricing",
      heading: "Plans that scale with your business",
      monthly: "Monthly",
      yearly: "Yearly",
      save: "Save 20%",
      badge: "Recommended",
      cta: "Choose Plan",
      plans: [
        {
          plan: "Free",
          features: [
            "1 Store location",
            "Basic menu setup",
            "Limited orders",
            "Standard support",
          ],
        },
        {
          plan: "Pro",
          features: [
            "Unlimited menu items",
            "Real-time dashboard",
            "Image uploads",
            "Priority support",
            "Basic analytics",
          ],
        },
        {
          plan: "Business",
          features: [
            "Multi-branch management",
            "Advanced analytics",
            "Staff accounts",
            "API access",
            "24/7 dedicated support",
          ],
        },
      ],
    },
    cta: {
      heading: "Start your smart restaurant today",
      subtext:
        "Join thousands of restaurants already using QRDINE to power their ordering process.",
      btn1: "Get Started Free",
      btn2: "Talk to Sales",
    },
    footer: {
      tagline:
        "Revolutionizing the restaurant industry with seamless QR ordering solutions.",
      product: "Product",
      company: "Company",
      resources: "Resources",
      productLinks: ["Features", "Integrations", "Pricing", "Changelog"],
      companyLinks: ["About", "Blog", "Careers", "Contact"],
      resourceLinks: [
        "Documentation",
        "Help Center",
        "Community",
        "Privacy Policy",
      ],
      copyright: "QRDINE Inc. All rights reserved.",
      privacy: "Privacy",
      terms: "Terms",
      cookies: "Cookies",
    },
  },
  th: {
    nav: {
      home: "หน้าแรก",
      features: "ฟีเจอร์",
      pricing: "ราคา",
      about: "เกี่ยวกับ",
      login: "เข้าสู่ระบบ",
      getStarted: "เริ่มต้นใช้งาน",
    },
    hero: {
      headline1: "เปลี่ยนร้านอาหารของคุณให้เป็น",
      headline2: "ระบบสั่งอาหาร QR อัจฉริยะ",
      headline3: "",
      subtext:
        "จัดการเมนู คำสั่งซื้อ และลูกค้าแบบเรียลไทม์ — ไม่ต้องดาวน์โหลดแอป เพิ่มประสบการณ์และประสิทธิภาพได้ทันที",
      cta1: "เริ่มใช้งานฟรี",
      cta2: "ดูตัวอย่าง",
      orderBadge: "ออเดอร์ใหม่",
      orderDetail: "โต๊ะ 12 • ฿1,500",
    },
    features: {
      label: "ฟีเจอร์",
      heading: "ทุกสิ่งที่คุณต้องการสำหรับร้านอาหารยุคใหม่",
      subtext: "หยุดรอแอป มอบอิสระให้ลูกค้าสั่งอาหารได้ทันทีเมื่อพร้อม",
      items: [
        {
          title: "แดชบอร์ดเรียลไทม์",
          description: "จัดการออเดอร์ทันทีด้วยระบบแสดงผลครัวสดที่อัปเดตแบบเรียลไทม์",
        },
        {
          title: "สั่งอาหารผ่าน QR",
          description: "QR โค้ดเฉพาะสำหรับทุกโต๊ะ ลูกค้าไม่ต้องดาวน์โหลดแอปใดๆ",
        },
        {
          title: "จัดการเมนู",
          description: "อัปเดตเมนูได้ภายในไม่กี่วินาที เปลี่ยนราคา รายการ และหมวดหมู่ได้ทันที",
        },
        {
          title: "ภาพถ่ายอาหาร",
          description: "อัปโหลดภาพคุณภาพสูงเพื่อโชว์จานอาหารและเพิ่มมูลค่าการสั่งซื้อ",
        },
        {
          title: "รองรับหลายสาขา",
          description: "จัดการหลายสาขาจากแดชบอร์ดหลักเพียงหน้าเดียว",
        },
        {
          title: "อัปเดตสถานะสด",
          description:
            "การแจ้งเตือนอัตโนมัติสำหรับพนักงานและลูกค้าเกี่ยวกับความคืบหน้าของออเดอร์",
        },
      ],
    },
    steps: {
      label: "ขั้นตอน",
      heading: "สามขั้นตอนสู่ครัวที่ชาญฉลาดยิ่งขึ้น",
      items: [
        {
          title: "สร้างร้านอาหาร",
          description: "สมัครและตั้งค่าโปรไฟล์ร้านอาหารของคุณในไม่กี่นาที",
        },
        {
          title: "สร้าง QR โค้ด",
          description: "ออกแบบและพิมพ์ QR โค้ดเฉพาะสำหรับแต่ละโต๊ะ",
        },
        {
          title: "รับออเดอร์",
          description: "รับและจัดการคำสั่งซื้อของลูกค้าแบบเรียลไทม์",
        },
      ],
    },
    pricing: {
      label: "ราคา",
      heading: "แผนที่เติบโตตามธุรกิจของคุณ",
      monthly: "รายเดือน",
      yearly: "รายปี",
      save: "ประหยัด 20%",
      badge: "แนะนำ",
      cta: "เลือกแผนนี้",
      plans: [
        {
          plan: "ฟรี",
          features: [
            "1 สาขา",
            "ตั้งค่าเมนูพื้นฐาน",
            "ออเดอร์จำกัด",
            "การสนับสนุนมาตรฐาน",
          ],
        },
        {
          plan: "โปร",
          features: [
            "รายการเมนูไม่จำกัด",
            "แดชบอร์ดเรียลไทม์",
            "อัปโหลดภาพอาหาร",
            "การสนับสนุนลำดับความสำคัญ",
            "วิเคราะห์ข้อมูลพื้นฐาน",
          ],
        },
        {
          plan: "ธุรกิจ",
          features: [
            "จัดการหลายสาขา",
            "วิเคราะห์ข้อมูลขั้นสูง",
            "บัญชีพนักงาน",
            "การเข้าถึง API",
            "ซัพพอร์ต 24/7",
          ],
        },
      ],
    },
    cta: {
      heading: "เริ่มต้นร้านอาหารอัจฉริยะของคุณวันนี้",
      subtext: "ร่วมกับร้านอาหารหลายพันแห่งที่ใช้ QRDINE ขับเคลื่อนระบบสั่งอาหาร",
      btn1: "เริ่มใช้งานฟรี",
      btn2: "ติดต่อทีมขาย",
    },
    footer: {
      tagline: "พลิกโฉมอุตสาหกรรมร้านอาหารด้วยโซลูชันการสั่งซื้อผ่าน QR ที่ราบรื่น",
      product: "ผลิตภัณฑ์",
      company: "บริษัท",
      resources: "ทรัพยากร",
      productLinks: ["ฟีเจอร์", "การเชื่อมต่อ", "ราคา", "บันทึกการเปลี่ยนแปลง"],
      companyLinks: ["เกี่ยวกับ", "บล็อก", "ร่วมงานกับเรา", "ติดต่อ"],
      resourceLinks: ["เอกสาร", "ศูนย์ช่วยเหลือ", "ชุมชน", "นโยบายความเป็นส่วนตัว"],
      copyright: "QRDINE Inc. สงวนลิขสิทธิ์",
      privacy: "ความเป็นส่วนตัว",
      terms: "ข้อกำหนด",
      cookies: "คุกกี้",
    },
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");
  const t = translations[lang];
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}



