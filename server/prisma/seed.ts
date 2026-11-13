import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

const yt = (id: string, seconds = 0) =>
  `https://www.youtube.com/watch?v=${id}${seconds ? `&t=${seconds}s` : ""}`;
const thumb = (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

type SeedCourse = {
  title: string;
  description: string;
  price: number;
  videoId: string;
  lectures: { title: string; description: string; at: number }[];
};

const courses: SeedCourse[] = [
  {
    title: "React for Beginners: Build 8 Real Projects",
    description:
      "Learn React from scratch by building real projects. Covers JSX, components, props, state, conditional rendering, forms, side effects with useEffect and local storage. Ideal for developers who know basic JavaScript and want to build modern UIs.",
    price: 19.99,
    videoId: "bMknfKXIFA8",
    lectures: [
      { title: "Course Introduction", description: "What you will build and how the course is organised.", at: 0 },
      { title: "Mental Outline of the Project", description: "Plan the project before writing any code.", at: 6363 },
      { title: "Walking Through the Figma Design", description: "Read a design file and break it into components.", at: 6600 },
      { title: "Project Setup", description: "Scaffold the project and organise the folder structure.", at: 6703 },
    ],
  },
  {
    title: "Node.js & Express.js: Build REST APIs",
    description:
      "A complete back-end course. Learn Node fundamentals, modules, the event loop and streams, then build REST APIs with Express using routers, middleware and the MVC pattern. Finish by connecting a MongoDB-backed app.",
    price: 24.99,
    videoId: "Oe421EPjeBE",
    lectures: [
      { title: "Introduction to Node and Express", description: "What Node is and why we use Express on top of it.", at: 0 },
      { title: "Node.js Fundamentals", description: "Modules, globals and running JavaScript outside the browser.", at: 1200 },
      { title: "Building a Basic Express Server", description: "Handle requests and send responses with Express.", at: 13500 },
    ],
  },
  {
    title: "PostgreSQL: Complete Database Course",
    description:
      "Master relational databases with PostgreSQL. Learn SQL from the ground up: creating tables, inserting and querying data, filtering, grouping, constraints, primary keys, joins and UUIDs. Taught entirely from the command line.",
    price: 14.99,
    videoId: "qw--VYLpxG4",
    lectures: [
      { title: "What is a Database?", description: "Why databases exist and what problems they solve.", at: 196 },
      { title: "SQL and Relational Databases", description: "Tables, rows, columns and the relational model.", at: 317 },
      { title: "What is PostgreSQL?", description: "History and strengths of Postgres.", at: 550 },
      { title: "Installing PostgreSQL on Windows", description: "Step-by-step Windows installation.", at: 861 },
      { title: "UUIDs as Primary Keys", description: "When and why to use UUID primary keys.", at: 14754 },
    ],
  },
  {
    title: "TypeScript: The Full Tutorial",
    description:
      "Learn TypeScript, the typed superset of JavaScript. Understand types, interfaces, generics, classes and how the compiler catches bugs before runtime. A must-have skill for modern React and Node.js development.",
    price: 0,
    videoId: "30LWjhZzg50",
    lectures: [
      { title: "Why TypeScript?", description: "The benefits of static typing over plain JavaScript.", at: 0 },
      { title: "Basic Types", description: "Primitive types, arrays, tuples and type inference.", at: 900 },
    ],
  },
  {
    title: "Full Stack React Developer Course",
    description:
      "Go beyond the basics: learn how React works internally, then build several projects using hooks, custom hooks, React Router, Context API and Redux Toolkit, finishing with a full-stack app backed by Appwrite.",
    price: 29.99,
    videoId: "Bvwq_S0n2pk",
    lectures: [
      { title: "React Roadmap", description: "What to learn and in what order.", at: 0 },
      { title: "Creating React Projects", description: "Set up projects with Vite and understand the files.", at: 1205 },
    ],
  },
];

async function main() {
  const email = (process.env.ADMIN_EMAIL || "admin@lms.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "admin123";

  await prisma.admin.upsert({
    where: { email },
    update: { password: await bcrypt.hash(password, 10) },
    create: { name: "Admin", email, password: await bcrypt.hash(password, 10) },
  });
 console.log(`Admin ready: ${email}`);

  // Only add sample courses to an empty database, so redeploys never wipe admin-created data.
  // Set SEED_RESET=true to force a reset back to the sample set.
  const existing = await prisma.course.count();
  if (existing > 0 && process.env.SEED_RESET !== "true") {
    console.log(`Database already has ${existing} course(s); skipping sample data (set SEED_RESET=true to reset).`);
    return;
  }
  await prisma.lecture.deleteMany();
  await prisma.course.deleteMany();

  for (const c of courses) {
    await prisma.course.create({
      data: {
        title: c.title,
        description: c.description,
        price: c.price,
        thumbnailUrl: thumb(c.videoId),
        lectures: {
          create: c.lectures.map((l, i) => ({
            title: l.title,
            description: l.description,
            videoUrl: yt(c.videoId, l.at),
            order: i + 1,
          })),
        },
      },
    });
  }

  // One lecture with a direct MP4 file, to show non-YouTube playback.
  const ts = await prisma.course.findFirst({ where: { title: { startsWith: "TypeScript" } } });
  if (ts) {
    await prisma.lecture.create({
      data: {
        courseId: ts.id,
        title: "Bonus: Direct MP4 Playback Demo",
        description: "This lecture uses a plain .mp4 URL instead of YouTube, played with the HTML5 video player.",
        videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        order: 3,
      },
    });
  }

  console.log(`Seeded ${courses.length} courses.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
