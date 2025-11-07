import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

export async function up(queryInterface) {
  const now = new Date();

  const courses = await queryInterface.sequelize.query(
    `SELECT id, title FROM courses`,
    { type: queryInterface.sequelize.QueryTypes.SELECT }
  );

  // 🎥 Danh sách video thật (YouTube)
  const youtubeLinks = [
    "https://www.youtube.com/watch?v=rfscVS0vtbw", // Python
    "https://www.youtube.com/watch?v=PkZNo7MFNFg", // JavaScript
    "https://www.youtube.com/watch?v=Oe421EPjeBE", // React
    "https://www.youtube.com/watch?v=pKd0Rpw7O48", // Node.js
    "https://www.youtube.com/watch?v=Z1Yd7upQsXY", // Django
    "https://www.youtube.com/watch?v=RGOj5yH7evk", // Git & GitHub
    "https://www.youtube.com/watch?v=1Rs2ND1ryYc", // HTML & CSS
    "https://www.youtube.com/watch?v=TiMRwri1xJ8", // ReactJS (F8)
    "https://www.youtube.com/watch?v=qz0aGYrrlhU", // HTML Crash Course
    "https://www.youtube.com/watch?v=8mAITcNt710", // CSS Crash Course
    "https://www.youtube.com/watch?v=SBmSRK3feww", // TypeScript Basics
    "https://www.youtube.com/watch?v=bMknfKXIFA8", // React 2025 Course
    "https://www.youtube.com/watch?v=Ke90Tje7VS0", // React Official Tutorial
  ];

  // 📚 Danh sách tài nguyên học tập thật
  const resourceLinks = [
    "https://www.w3schools.com/",
    "https://developer.mozilla.org/",
    "https://freecodecamp.org/",
    "https://roadmap.sh/",
    "https://react.dev/",
    "https://nodejs.org/en/docs/",
    "https://www.geeksforgeeks.org/",
    "https://www.fullstack.edu.vn/", // F8
  ];

  // 🧩 Hàm convert watch?v= → embed/
  const convertToEmbedUrl = (url) => {
    const match = url.match(/v=([^&]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  const lessons = [];

  for (const course of courses) {
    // 🔢 Mỗi khóa học có 5–12 bài học
    const lessonCount = faker.number.int({ min: 5, max: 12 });

    for (let i = 0; i < lessonCount; i++) {
      const videoUrl = convertToEmbedUrl(
        faker.helpers.arrayElement(youtubeLinks)
      );
      const resources = faker.helpers.arrayElements(resourceLinks, 2);

      lessons.push({
        id: uuidv4(),
        courseId: course.id,
        title: `Lesson ${i + 1}: ${faker.company.catchPhrase()}`,
        content: faker.lorem.paragraphs(2),
        videoUrl,
        resourceUrls: JSON.stringify(resources),
        duration: faker.number.int({ min: 300, max: 1800 }), // 5–30 phút
        position: i + 1,
        isFreePreview: faker.datatype.boolean(),
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  await queryInterface.bulkInsert("lessons", lessons, {});
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("lessons", null, {});
}
