// @ts-nocheck
import type { Escrow } from "@/@types/escrow.entity";

export const mockEscrowData: Escrow[] = [
  {
    contractId: "mock-contract-1",
    title: "E-Commerce Website Development",
    description:
      "Complete redesign and development of modern e-commerce platform with payment integration",
    amount: 7500,
    platformFee: 375,
    balance: 7500,
    engagementId: "ENG-2024-001",
    roles: {
      serviceProvider: "0x1234567890abcdef1234567890abcdef12345678",
      approver: "0xabcdef1234567890abcdef1234567890abcdef12",
      platformAddress: "0x1111111111111111111111111111111111111111",
      releaseSigner: "0x2222222222222222222222222222222222222222",
      disputeResolver: "0x3333333333333333333333333333333333333333",
      receiver: "0x4444444444444444444444444444444444444444",
    },
    type: "multi-release",
    user: "0x1234567890abcdef1234567890abcdef12345678",
    trustline: {
      name: "USDC",
    },
    createdAt: {
      _seconds: Math.floor(Date.now() / 1000) - 86400 * 5,
      _nanoseconds: 0,
    },
    updatedAt: {
      _seconds: Math.floor(Date.now() / 1000) - 86400 * 1,
      _nanoseconds: 0,
    },
    flags: {
      released: false,
      disputed: false,
      resolved: false,
    },
    milestones: [
      {
        title: "UI/UX Design",
        description: "Create wireframes, mockups, and user interface design",
        amount: 2000,
        status: "completed",
        flags: { approved: true },
      },
      {
        title: "Frontend Development",
        description: "Build responsive frontend with React and modern styling",
        amount: 3000,
        status: "pending",
        flags: { approved: false },
      },
      {
        title: "Backend & Payment Integration",
        description: "API development and payment gateway integration",
        amount: 2500,
        status: "pending",
        flags: { approved: false },
      },
    ],
  },
  {
    contractId: "mock-contract-2",
    title: "Smart Contract Security Audit",
    description:
      "Comprehensive security audit for DeFi lending protocol smart contracts",
    amount: 12000,
    platformFee: 600,
    balance: 12000,
    engagementId: "ENG-2024-002",
    roles: {
      serviceProvider: "0xfedcba0987654321fedcba0987654321fedcba09",
      approver: "0x1111222233334444555566667777888899990000",
      platformAddress: "0x1111111111111111111111111111111111111111",
      releaseSigner: "0x2222222222222222222222222222222222222222",
      disputeResolver: "0x3333333333333333333333333333333333333333",
      receiver: "0x4444444444444444444444444444444444444444",
    },
    type: "single-release",
    user: "0xfedcba0987654321fedcba0987654321fedcba09",
    trustline: {
      name: "USDC",
    },
    createdAt: {
      _seconds: Math.floor(Date.now() / 1000) - 86400 * 2,
      _nanoseconds: 0,
    },
    updatedAt: {
      _seconds: Math.floor(Date.now() / 1000) - 86400 * 1,
      _nanoseconds: 0,
    },
    flags: {
      released: true,
      disputed: false,
      resolved: true,
    },
    milestones: [
      {
        title: "Complete Security Audit",
        description:
          "Full security assessment with detailed report and recommendations",
        amount: 12000,
        status: "completed",
        flags: { approved: true },
      },
    ],
  },
  {
    contractId: "mock-contract-3",
    title: "Mobile App Development - iOS & Android",
    description:
      "Cross-platform mobile application for fitness tracking with social features",
    amount: 15000,
    platformFee: 750,
    balance: 9000,
    engagementId: "ENG-2024-003",
    roles: {
      serviceProvider: "0xaaaaaabbbbbbccccccddddddeeeeeeffffffffff",
      approver: "0xbbbbbbccccccddddddeeeeeeffffffffaaaaaaaa",
      platformAddress: "0x1111111111111111111111111111111111111111",
      releaseSigner: "0x2222222222222222222222222222222222222222",
      disputeResolver: "0x3333333333333333333333333333333333333333",
      receiver: "0x4444444444444444444444444444444444444444",
    },
    type: "multi-release",
    user: "0xaaaaaabbbbbbccccccddddddeeeeeeffffffffff",
    trustline: {
      name: "USDC",
    },
    createdAt: {
      _seconds: Math.floor(Date.now() / 1000) - 86400 * 10,
      _nanoseconds: 0,
    },
    updatedAt: {
      _seconds: Math.floor(Date.now() / 1000) - 86400 * 2,
      _nanoseconds: 0,
    },
    flags: {
      released: false,
      disputed: false,
      resolved: false,
    },
    milestones: [
      {
        title: "App Architecture & Setup",
        description:
          "Project setup, architecture planning, and basic navigation",
        amount: 3000,
        status: "completed",
        flags: { approved: true },
      },
      {
        title: "Core Features Development",
        description:
          "User authentication, fitness tracking, and data visualization",
        amount: 6000,
        status: "completed",
        flags: { approved: true },
      },
      {
        title: "Social Features & Testing",
        description:
          "Social networking features, testing, and app store deployment",
        amount: 6000,
        status: "pending",
        flags: { approved: false },
      },
    ],
  },
  {
    contractId: "mock-contract-4",
    title: "Data Analytics Dashboard",
    description:
      "Business intelligence dashboard with real-time analytics and reporting features",
    amount: 4500,
    platformFee: 225,
    balance: 4500,
    engagementId: "ENG-2024-004",
    roles: {
      serviceProvider: "0xccccccddddddeeeeeeffffffffaaaaaaaabbbbbb",
      approver: "0xddddddeeeeeeffffffffaaaaaaaabbbbbbcccccc",
      platformAddress: "0x1111111111111111111111111111111111111111",
      releaseSigner: "0x2222222222222222222222222222222222222222",
      disputeResolver: "0x3333333333333333333333333333333333333333",
      receiver: "0x4444444444444444444444444444444444444444",
    },
    type: "multi-release",
    user: "0xccccccddddddeeeeeeffffffffaaaaaaaabbbbbb",
    trustline: {
      name: "USDC",
    },
    createdAt: {
      _seconds: Math.floor(Date.now() / 1000) - 86400 * 1,
      _nanoseconds: 0,
    },
    updatedAt: {
      _seconds: Math.floor(Date.now() / 1000) - 86400 * 1,
      _nanoseconds: 0,
    },
    flags: {
      released: false,
      disputed: true,
      resolved: false,
    },
    milestones: [
      {
        title: "Dashboard Design & Setup",
        description: "UI design and basic dashboard structure",
        amount: 1500,
        status: "completed",
        flags: { approved: true },
      },
      {
        title: "Data Integration & Visualization",
        description: "Connect data sources and create interactive charts",
        amount: 3000,
        status: "pending",
        flags: { approved: false },
      },
    ],
  },
];
