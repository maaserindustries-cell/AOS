# PMOS Domain Model

## Purpose

The PMOS Domain Model defines the core objects that exist within the Promotional Media Operating System.

These objects are independent of any website, application, database, or programming language.

They describe the business itself.

Every implementation of PMOS should preserve this model.

---

# Core Principle

Objects exist before interfaces.

The website is not PMOS.

The app is not PMOS.

The database is not PMOS.

These are all interfaces to the same underlying system.

---

# Publisher

The organization operating promotional media.

Responsibilities:

- Create campaigns
- Set pricing
- Manage inventory
- Approve artwork
- Release campaigns to print
- Manage locations

Relationships:

Publisher owns Locations.

Publisher creates Campaigns.

---

# Location

A geographic market served by PMOS.

Examples:

- St. Augustine
- Jacksonville
- Orlando

Properties:

- Name
- State
- Mail routes
- Default printer
- Active campaigns

Relationships:

Location contains Campaigns.

---

# Campaign Type

A reusable campaign design.

Examples:

- Restaurant Promotional Postcard
- Service Business Promotional Postcard
- Magazine
- Coupon Book
- Visitor Guide

Campaign Types define reusable structure.

---

# Campaign Edition

A specific campaign.

Example:

St. Augustine

Restaurant Promotional Postcard

Founders Edition #001

July 2026

Properties:

- Status
- Mail date
- Mailbox count
- Layout
- Pricing
- Available inventory

---

# Layout

Defines the physical arrangement of promotional positions.

Examples:

Restaurant Standard

Service Standard

Properties:

- Front positions
- Back positions
- Micro mentions
- Orientation
- Dimensions

Layouts contain no advertiser content.

---

# Position

An individual promotional space.

Examples:

F1

F2

B3

M5

Properties:

- Position ID
- Size
- Price
- Status
- Assigned category
- Assigned advertiser

---

# Category

A business category.

Examples:

Pizza

Coffee

Roofing

HVAC

Properties:

- Name
- Exclusive
- Assigned advertiser

Categories may be exclusive within a campaign.

---

# Advertiser

A participating business.

Properties:

- Business name
- Contact
- Phone
- Email
- Website
- Logo
- Artwork
- Offers
- QR destination

Relationships:

Advertiser reserves Positions.

Advertiser occupies Categories.

---

# Reservation

Represents an advertiser holding inventory.

Properties:

- Date
- Position
- Category
- Status
- Expiration
- Payment status

---

# Payment

Records financial transactions.

Properties:

- Amount
- Method
- Stripe reference
- Status
- Timestamp

Successful payment confirms Reservation.

---

# Artwork Submission

Creative assets supplied by an advertiser.

Properties:

- Logo
- Images
- Offer
- Contact information
- QR code destination

---

# Proof

A review copy awaiting approval.

States:

Pending

Approved

Rejected

Revision Required

Printing cannot proceed until approval.

---

# Distribution

Represents campaign fulfillment.

Properties:

- Printer
- Mail date
- USPS routes
- Quantity
- Completion status

---

# Rules

PMOS enforces business rules independently of the user interface.

Examples:

- One advertiser per exclusive category.
- One advertiser per position.
- Paid reservations lock inventory.
- Approved proof required before printing.
- Layout templates remain independent from campaign content.

---

# Relationships

Publisher

↓

Location

↓

Campaign Edition

↓

Layout

↓

Positions

↓

Reservations

↓

Advertisers

↓

Artwork

↓

Proof

↓

Distribution

Payments connect to Reservations.

Categories connect Positions and Advertisers.

---

# Future Objects

Potential future additions include:

- Coupons
- Promo codes
- Analytics
- AI recommendations
- Print vendors
- Shipping
- Customer reviews
- Multi-location advertisers

The domain model should expand through new objects rather than modification of existing objects whenever practical.

---

# Architectural Principle

The PMOS Domain Model is the single source of truth for every future implementation of PMOS.

Websites, mobile apps, APIs, databases, dashboards, and automation should all be generated from this model rather than redefining it independently.
