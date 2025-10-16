import { v4 as uuidv4 } from "uuid";

export async function up(queryInterface, Sequelize) {
  const now = new Date();

  const categories = [
    { 
      id: uuidv4(), 
      name: "Web Development", 
      slug: "web-development", 
      description: "Khóa học về phát triển web frontend/backend", 
      status: "active", 
      createdAt: now, 
      updatedAt: now 
    },
    { 
      id: uuidv4(), 
      name: "Mobile App Development", 
      slug: "mobile-app-development", 
      description: "Khóa học về lập trình ứng dụng di động (Android, iOS, Flutter...)", 
      status: "active", 
      createdAt: now, 
      updatedAt: now 
    },
    { 
      id: uuidv4(), 
      name: "Data Science", 
      slug: "data-science", 
      description: "Khóa học về khoa học dữ liệu, phân tích, Python, R", 
      status: "active", 
      createdAt: now, 
      updatedAt: now 
    },
    { 
      id: uuidv4(), 
      name: "AI & Machine Learning", 
      slug: "ai-ml", 
      description: "Khóa học về trí tuệ nhân tạo, machine learning, deep learning", 
      status: "active", 
      createdAt: now, 
      updatedAt: now 
    },
    { 
      id: uuidv4(), 
      name: "DevOps & Cloud", 
      slug: "devops-cloud", 
      description: "Khóa học về CI/CD, Docker, Kubernetes, AWS, Azure", 
      status: "active", 
      createdAt: now, 
      updatedAt: now 
    },
    { 
      id: uuidv4(), 
      name: "Cybersecurity", 
      slug: "cybersecurity", 
      description: "Khóa học về an toàn thông tin, pentest, bảo mật hệ thống", 
      status: "active", 
      createdAt: now, 
      updatedAt: now 
    },
  ];

  await queryInterface.bulkInsert("categories", categories, {});
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("categories", null, {});
}
