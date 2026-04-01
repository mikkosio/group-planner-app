/**
 * Prisma seed script — run with: npm run db:seed
 *
 * Creates 15 users across 5 thematic groups with realistic memberships.
 * All users share the password: Seed1234
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;
const DEFAULT_PASSWORD = "Seed1234";

async function main() {
    console.log("🌱 Seeding database...");

    // ─── Wipe existing seed data (idempotent) ───────────────────────────────
    await prisma.vote.deleteMany();
    await prisma.activity.deleteMany();
    await prisma.membership.deleteMany();
    await prisma.group.deleteMany();
    await prisma.user.deleteMany();

    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);

    // ─── Users ───────────────────────────────────────────────────────────────
    const [
        alice, bob, carol, david, emma,
        frank, grace, henry, isabel, james,
        kate, liam, maya, noah, olivia,
    ] = await Promise.all([
        prisma.user.create({ data: { name: "Alice Chen",      email: "alice@example.com",  password: hashedPassword } }),
        prisma.user.create({ data: { name: "Bob Martinez",    email: "bob@example.com",    password: hashedPassword } }),
        prisma.user.create({ data: { name: "Carol Johnson",   email: "carol@example.com",  password: hashedPassword } }),
        prisma.user.create({ data: { name: "David Kim",       email: "david@example.com",  password: hashedPassword } }),
        prisma.user.create({ data: { name: "Emma Wilson",     email: "emma@example.com",   password: hashedPassword } }),
        prisma.user.create({ data: { name: "Frank Lee",       email: "frank@example.com",  password: hashedPassword } }),
        prisma.user.create({ data: { name: "Grace Patel",     email: "grace@example.com",  password: hashedPassword } }),
        prisma.user.create({ data: { name: "Henry Brown",     email: "henry@example.com",  password: hashedPassword } }),
        prisma.user.create({ data: { name: "Isabel Torres",   email: "isabel@example.com", password: hashedPassword } }),
        prisma.user.create({ data: { name: "James Nguyen",    email: "james@example.com",  password: hashedPassword } }),
        prisma.user.create({ data: { name: "Kate Davis",      email: "kate@example.com",   password: hashedPassword } }),
        prisma.user.create({ data: { name: "Liam Thompson",   email: "liam@example.com",   password: hashedPassword } }),
        prisma.user.create({ data: { name: "Maya Rodriguez",  email: "maya@example.com",   password: hashedPassword } }),
        prisma.user.create({ data: { name: "Noah White",      email: "noah@example.com",   password: hashedPassword } }),
        prisma.user.create({ data: { name: "Olivia Scott",    email: "olivia@example.com", password: hashedPassword } }),
    ]);

    console.log(`✅ Created 15 users`);

    // ─── Groups ───────────────────────────────────────────────────────────────
    // Each group: creator auto-gets Admin membership below
    const [hikers, bookclub, foodies, devStudy, photography] = await Promise.all([
        prisma.group.create({
            data: {
                name: "Weekend Hikers",
                description: "Exploring trails around Vancouver every weekend.",
                inviteCode: "A1B2C3",
                creatorId: alice.id,
            },
        }),
        prisma.group.create({
            data: {
                name: "Book Club",
                description: "Monthly reads across genres — fiction, non-fiction, sci-fi.",
                inviteCode: "D4E5F6",
                creatorId: carol.id,
            },
        }),
        prisma.group.create({
            data: {
                name: "Foodies Vancouver",
                description: "Restaurant crawls, cooking nights, and food adventures.",
                inviteCode: "7A8B9C",
                creatorId: bob.id,
            },
        }),
        prisma.group.create({
            data: {
                name: "Dev Study Group",
                description: "Weekly coding sessions, project reviews, and tech talks.",
                inviteCode: "F1E2D3",
                creatorId: david.id,
            },
        }),
        prisma.group.create({
            data: {
                name: "Photography Club",
                description: "Photo walks, critique sessions, and editing workshops.",
                inviteCode: "C4B5A6",
                creatorId: emma.id,
            },
        }),
    ]);

    console.log(`✅ Created 5 groups`);

    // ─── Memberships ─────────────────────────────────────────────────────────
    // Format: { userId, groupId, role }
    // Creators are Admin; all others are Member.
    await prisma.membership.createMany({
        data: [
            // Weekend Hikers — creator: Alice
            { userId: alice.id,   groupId: hikers.id, role: "Admin" },
            { userId: bob.id,     groupId: hikers.id, role: "Member" },
            { userId: carol.id,   groupId: hikers.id, role: "Member" },
            { userId: david.id,   groupId: hikers.id, role: "Member" },
            { userId: emma.id,    groupId: hikers.id, role: "Member" },

            // Book Club — creator: Carol
            { userId: carol.id,   groupId: bookclub.id, role: "Admin" },
            { userId: alice.id,   groupId: bookclub.id, role: "Member" },
            { userId: emma.id,    groupId: bookclub.id, role: "Member" },
            { userId: grace.id,   groupId: bookclub.id, role: "Member" },
            { userId: kate.id,    groupId: bookclub.id, role: "Member" },
            { userId: olivia.id,  groupId: bookclub.id, role: "Member" },

            // Foodies Vancouver — creator: Bob
            { userId: bob.id,     groupId: foodies.id, role: "Admin" },
            { userId: frank.id,   groupId: foodies.id, role: "Member" },
            { userId: henry.id,   groupId: foodies.id, role: "Member" },
            { userId: isabel.id,  groupId: foodies.id, role: "Member" },
            { userId: james.id,   groupId: foodies.id, role: "Member" },
            { userId: liam.id,    groupId: foodies.id, role: "Member" },

            // Dev Study Group — creator: David
            { userId: david.id,   groupId: devStudy.id, role: "Admin" },
            { userId: frank.id,   groupId: devStudy.id, role: "Member" },
            { userId: grace.id,   groupId: devStudy.id, role: "Member" },
            { userId: james.id,   groupId: devStudy.id, role: "Member" },
            { userId: liam.id,    groupId: devStudy.id, role: "Member" },
            { userId: maya.id,    groupId: devStudy.id, role: "Member" },
            { userId: noah.id,    groupId: devStudy.id, role: "Member" },

            // Photography Club — creator: Emma
            { userId: emma.id,    groupId: photography.id, role: "Admin" },
            { userId: carol.id,   groupId: photography.id, role: "Member" },
            { userId: henry.id,   groupId: photography.id, role: "Member" },
            { userId: kate.id,    groupId: photography.id, role: "Member" },
            { userId: noah.id,    groupId: photography.id, role: "Member" },
            { userId: olivia.id,  groupId: photography.id, role: "Member" },
            { userId: maya.id,    groupId: photography.id, role: "Member" },
        ],
    });

    console.log(`✅ Created memberships`);

    // ─── Activities ──────────────────────────────────────────────────────────
    // Each group has multiple proposed activities
    await prisma.activity.createMany({
        data: [
            // Weekend Hikers — Alice's group
            { 
                groupId: hikers.id, 
                userId: alice.id, 
                title: "Grouse Grind Challenge",
                description: "Classic Vancouver hike. Bring water and snacks!",
                proposedTime: new Date("2026-04-05T09:00:00Z"),
                isWinner: false,
                createdAt: new Date("2026-03-15T10:30:00Z")
            },
            { 
                groupId: hikers.id, 
                userId: bob.id, 
                title: "Lynn Canyon Suspension Bridge",
                description: "Beautiful forest trails and free suspension bridge.",
                proposedTime: new Date("2026-04-05T10:00:00Z"),
                isWinner: false,
                createdAt: new Date("2026-03-16T14:20:00Z")
            },
            { 
                groupId: hikers.id, 
                userId: carol.id, 
                title: "Lighthouse Park Trail",
                description: "Easy coastal hike with stunning ocean views.",
                proposedTime: new Date("2026-04-12T09:30:00Z"),
                isWinner: false,
                createdAt: new Date("2026-03-18T09:15:00Z")
            },

            // Book Club — Carol's group
            { 
                groupId: bookclub.id, 
                userId: carol.id, 
                title: "April Book Discussion",
                description: "Discussing 'Project Hail Mary' by Andy Weir",
                proposedTime: new Date("2026-04-15T19:00:00Z"),
                isWinner: false,
                createdAt: new Date("2026-03-10T16:45:00Z")
            },
            { 
                groupId: bookclub.id, 
                userId: grace.id, 
                title: "Coffee Shop Meetup",
                description: "Casual chat at Revolver Coffee on Cambie",
                proposedTime: new Date("2026-04-08T14:00:00Z"),
                isWinner: false,
                createdAt: new Date("2026-03-12T11:30:00Z")
            },
            { 
                groupId: bookclub.id, 
                userId: olivia.id, 
                title: "Book Swap & Brunch",
                description: "Bring books to trade, brunch at The Oakwood",
                proposedTime: new Date("2026-04-22T11:00:00Z"),
                isWinner: false,
                createdAt: new Date("2026-03-20T13:00:00Z")
            },

            // Foodies Vancouver — Bob's group
            { 
                groupId: foodies.id, 
                userId: bob.id, 
                title: "Dim Sum Tour - Chinatown",
                description: "Hit 3 best dim sum spots in one afternoon!",
                proposedTime: new Date("2026-03-30T12:00:00Z"),
                isWinner: false,
                createdAt: new Date("2026-03-08T15:20:00Z")
            },
            { 
                groupId: foodies.id, 
                userId: frank.id, 
                title: "Sushi Making Workshop",
                description: "Learn to roll sushi at home. BYOB!",
                proposedTime: new Date("2026-04-10T18:00:00Z"),
                isWinner: false,
                createdAt: new Date("2026-03-14T12:10:00Z")
            },
            { 
                groupId: foodies.id, 
                userId: isabel.id, 
                title: "Food Truck Friday",
                description: "Sampling the best food trucks at Olympic Village",
                proposedTime: new Date("2026-04-03T17:30:00Z"),
                isWinner: false,
                createdAt: new Date("2026-03-11T19:45:00Z")
            },
            { 
                groupId: foodies.id, 
                userId: james.id, 
                title: "Italian Cooking Night",
                description: "Making fresh pasta from scratch at my place",
                proposedTime: new Date("2026-04-17T19:00:00Z"),
                isWinner: false,
                createdAt: new Date("2026-03-22T10:30:00Z")
            },

            // Dev Study Group — David's group
            { 
                groupId: devStudy.id, 
                userId: david.id, 
                title: "React 19 Deep Dive",
                description: "Exploring new features and migration strategies",
                proposedTime: new Date("2026-03-28T18:00:00Z"),
                isWinner: false,
                createdAt: new Date("2026-03-05T14:00:00Z")
            },
            { 
                groupId: devStudy.id, 
                userId: frank.id, 
                title: "Leetcode Practice Session",
                description: "Team coding session - medium difficulty problems",
                proposedTime: new Date("2026-04-04T19:00:00Z"),
                isWinner: false,
                createdAt: new Date("2026-03-13T17:25:00Z")
            },
            { 
                groupId: devStudy.id, 
                userId: maya.id, 
                title: "TypeScript Best Practices",
                description: "Review our group project's TS code together",
                proposedTime: new Date("2026-04-11T18:30:00Z"),
                isWinner: false,
                createdAt: new Date("2026-03-19T08:50:00Z")
            },
            { 
                groupId: devStudy.id, 
                userId: noah.id, 
                title: "Database Design Workshop",
                description: "Postgres optimization and indexing strategies",
                proposedTime: new Date("2026-04-18T17:00:00Z"),
                isWinner: false,
                createdAt: new Date("2026-03-24T11:15:00Z")
            },

            // Photography Club — Emma's group
            { 
                groupId: photography.id, 
                userId: emma.id, 
                title: "Golden Hour at Sunset Beach",
                description: "Capture the perfect sunset. Bring wide-angle lens!",
                proposedTime: new Date("2026-04-02T19:00:00Z"),
                isWinner: false,
                createdAt: new Date("2026-03-07T16:30:00Z")
            },
            { 
                groupId: photography.id, 
                userId: henry.id, 
                title: "Street Photography Walk - Gastown",
                description: "Exploring historic streets and urban scenes",
                proposedTime: new Date("2026-04-09T14:00:00Z"),
                isWinner: false,
                createdAt: new Date("2026-03-09T13:40:00Z")
            },
            { 
                groupId: photography.id, 
                userId: kate.id, 
                title: "Portrait Lighting Workshop",
                description: "Learn 3-point lighting setup at my studio",
                proposedTime: new Date("2026-04-16T10:00:00Z"),
                isWinner: false,
                createdAt: new Date("2026-03-17T15:10:00Z")
            },
            { 
                groupId: photography.id, 
                userId: olivia.id, 
                title: "Cherry Blossom Photo Walk",
                description: "VanDusen Garden's peak bloom season!",
                proposedTime: new Date("2026-04-06T10:00:00Z"),
                isWinner: false,
                createdAt: new Date("2026-03-21T09:25:00Z")
            },
        ],
    });

    console.log(`✅ Created 18 activities across all groups`);

    // ─── Votes ───────────────────────────────────────────────────────────────
    // Fetch created activities to get their IDs
    const activities = await prisma.activity.findMany();
    
    // Map activities by title for easier reference
    const activityMap = new Map(activities.map(a => [a.title, a]));
    
    // Create realistic voting patterns (users vote on activities in their groups)
    await prisma.vote.createMany({
        data: [
            // Weekend Hikers votes
            { userId: alice.id, activityId: activityMap.get("Grouse Grind Challenge")!.id },
            { userId: bob.id, activityId: activityMap.get("Grouse Grind Challenge")!.id },
            { userId: carol.id, activityId: activityMap.get("Grouse Grind Challenge")!.id },
            { userId: david.id, activityId: activityMap.get("Lynn Canyon Suspension Bridge")!.id },
            { userId: emma.id, activityId: activityMap.get("Lynn Canyon Suspension Bridge")!.id },
            { userId: alice.id, activityId: activityMap.get("Lighthouse Park Trail")!.id },
            { userId: bob.id, activityId: activityMap.get("Lighthouse Park Trail")!.id },
            { userId: carol.id, activityId: activityMap.get("Lighthouse Park Trail")!.id },
            { userId: david.id, activityId: activityMap.get("Lighthouse Park Trail")!.id },
            { userId: emma.id, activityId: activityMap.get("Lighthouse Park Trail")!.id },

            // Book Club votes
            { userId: carol.id, activityId: activityMap.get("April Book Discussion")!.id },
            { userId: alice.id, activityId: activityMap.get("April Book Discussion")!.id },
            { userId: emma.id, activityId: activityMap.get("April Book Discussion")!.id },
            { userId: grace.id, activityId: activityMap.get("April Book Discussion")!.id },
            { userId: kate.id, activityId: activityMap.get("April Book Discussion")!.id },
            { userId: olivia.id, activityId: activityMap.get("April Book Discussion")!.id },
            { userId: grace.id, activityId: activityMap.get("Coffee Shop Meetup")!.id },
            { userId: kate.id, activityId: activityMap.get("Coffee Shop Meetup")!.id },
            { userId: alice.id, activityId: activityMap.get("Book Swap & Brunch")!.id },
            { userId: olivia.id, activityId: activityMap.get("Book Swap & Brunch")!.id },

            // Foodies Vancouver votes
            { userId: bob.id, activityId: activityMap.get("Dim Sum Tour - Chinatown")!.id },
            { userId: frank.id, activityId: activityMap.get("Dim Sum Tour - Chinatown")!.id },
            { userId: henry.id, activityId: activityMap.get("Dim Sum Tour - Chinatown")!.id },
            { userId: isabel.id, activityId: activityMap.get("Dim Sum Tour - Chinatown")!.id },
            { userId: bob.id, activityId: activityMap.get("Sushi Making Workshop")!.id },
            { userId: frank.id, activityId: activityMap.get("Sushi Making Workshop")!.id },
            { userId: henry.id, activityId: activityMap.get("Sushi Making Workshop")!.id },
            { userId: james.id, activityId: activityMap.get("Sushi Making Workshop")!.id },
            { userId: liam.id, activityId: activityMap.get("Sushi Making Workshop")!.id },
            { userId: isabel.id, activityId: activityMap.get("Food Truck Friday")!.id },
            { userId: james.id, activityId: activityMap.get("Food Truck Friday")!.id },
            { userId: james.id, activityId: activityMap.get("Italian Cooking Night")!.id },
            { userId: liam.id, activityId: activityMap.get("Italian Cooking Night")!.id },

            // Dev Study Group votes
            { userId: david.id, activityId: activityMap.get("React 19 Deep Dive")!.id },
            { userId: frank.id, activityId: activityMap.get("React 19 Deep Dive")!.id },
            { userId: grace.id, activityId: activityMap.get("React 19 Deep Dive")!.id },
            { userId: james.id, activityId: activityMap.get("React 19 Deep Dive")!.id },
            { userId: liam.id, activityId: activityMap.get("React 19 Deep Dive")!.id },
            { userId: maya.id, activityId: activityMap.get("React 19 Deep Dive")!.id },
            { userId: noah.id, activityId: activityMap.get("React 19 Deep Dive")!.id },
            { userId: frank.id, activityId: activityMap.get("Leetcode Practice Session")!.id },
            { userId: maya.id, activityId: activityMap.get("Leetcode Practice Session")!.id },
            { userId: noah.id, activityId: activityMap.get("Leetcode Practice Session")!.id },
            { userId: david.id, activityId: activityMap.get("TypeScript Best Practices")!.id },
            { userId: grace.id, activityId: activityMap.get("TypeScript Best Practices")!.id },
            { userId: maya.id, activityId: activityMap.get("TypeScript Best Practices")!.id },
            { userId: liam.id, activityId: activityMap.get("Database Design Workshop")!.id },
            { userId: noah.id, activityId: activityMap.get("Database Design Workshop")!.id },

            // Photography Club votes
            { userId: emma.id, activityId: activityMap.get("Golden Hour at Sunset Beach")!.id },
            { userId: henry.id, activityId: activityMap.get("Golden Hour at Sunset Beach")!.id },
            { userId: kate.id, activityId: activityMap.get("Golden Hour at Sunset Beach")!.id },
            { userId: emma.id, activityId: activityMap.get("Street Photography Walk - Gastown")!.id },
            { userId: carol.id, activityId: activityMap.get("Street Photography Walk - Gastown")!.id },
            { userId: henry.id, activityId: activityMap.get("Street Photography Walk - Gastown")!.id },
            { userId: kate.id, activityId: activityMap.get("Street Photography Walk - Gastown")!.id },
            { userId: noah.id, activityId: activityMap.get("Street Photography Walk - Gastown")!.id },
            { userId: olivia.id, activityId: activityMap.get("Street Photography Walk - Gastown")!.id },
            { userId: maya.id, activityId: activityMap.get("Street Photography Walk - Gastown")!.id },
            { userId: carol.id, activityId: activityMap.get("Portrait Lighting Workshop")!.id },
            { userId: kate.id, activityId: activityMap.get("Portrait Lighting Workshop")!.id },
            { userId: emma.id, activityId: activityMap.get("Cherry Blossom Photo Walk")!.id },
            { userId: olivia.id, activityId: activityMap.get("Cherry Blossom Photo Walk")!.id },
            { userId: maya.id, activityId: activityMap.get("Cherry Blossom Photo Walk")!.id },
        ],
    });

    console.log(`✅ Created 63 votes across all activities`);
    console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Seed complete!

  All 15 users share the password: ${DEFAULT_PASSWORD}

  Group invite codes:
    Weekend Hikers     → A1B2C3  (creator: alice@example.com)
    Book Club          → D4E5F6  (creator: carol@example.com)
    Foodies Vancouver  → 7A8B9C  (creator: bob@example.com)
    Dev Study Group    → F1E2D3  (creator: david@example.com)
    Photography Club   → C4B5A6  (creator: emma@example.com)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
