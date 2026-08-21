# NOMAD — Budget Travel Planner

A modern, responsive travel planning web app designed to help travelers organize trips, manage budgets, plan itineraries, explore routes, and preserve travel memories — all from one visual dashboard.

Nomad combines **minimalism**, **Bento Grid UI**, and practical travel tools into a focused planning experience.

---

## Overview

Planning a trip often means switching between multiple applications for:

- Itineraries
- Maps
- Expenses
- Weather
- Travel schedules
- Memories

Nomad brings these essential tools together into one responsive workspace.

### Core idea

> Plan. Budget. Explore. Remember.

---

## Design Direction

Nomad intentionally avoids traditional dashboard-heavy layouts.

The interface follows:

- Minimalism
- Bento Grid layout
- Generous whitespace
- Clear visual hierarchy
- Soft rounded cards
- Subtle borders
- Lightweight micro-interactions
- Responsive-first design

The goal is to make travel planning feel simple instead of overwhelming.

---

## Features

### Trip Dashboard

View important trip information at a glance:

- Destination
- Route
- Travel dates
- Travelers
- Total budget
- Trip overview

### Budget Tracker

Track travel expenses with:

- Total budget
- Amount spent
- Spending percentage
- Expense categories
- Remaining budget
- Add/remove expenses

### Itinerary

Organize daily activities using a timeline:

- Time
- Activity
- Location
- Daily schedule

### Route

Visualize the main journey and important destinations through a dedicated route module.

### Weather & Local Time

Keep important destination information visible without leaving the dashboard.

### Travel Memories

Create a visual space for:

- Photos
- Locations
- Travel moments
- Trip highlights

### Responsive Navigation

Desktop:

- Persistent sidebar

Mobile:

- Hidden sidebar
- Hamburger menu
- Off-canvas navigation
- Backdrop interaction
- Automatic menu closing

### Theme

Nomad supports:

- Light mode
- Dark mode
- Persistent theme preference

### Local Storage

Trip and expense data can be stored locally in the browser so information remains available after refreshing the page.

---

## UI Architecture

```text
NOMAD
│
├── Dashboard
│   ├── Trip Overview
│   ├── Budget
│   ├── Weather
│   ├── Route
│   └── Memories
│
├── My Trips
│   ├── Active Trips
│   └── Create Trip
│
├── Itinerary
│   ├── Timeline
│   ├── Activities
│   └── Locations
│
├── Explore
│   ├── Destinations
│   ├── Routes
│   └── Recommendations
│
└── Memories
    ├── Photos
    └── Trip Moments
