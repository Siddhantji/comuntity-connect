// Simple script to create sample data for testing
// Run this after starting the backend server

const sampleUsers = [
  {
    name: "Green Earth NGO",
    email: "greenearth@example.com",
    password: "password123",
    role: "organization",
    location: "Bangalore, India",
    skills: []
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    role: "volunteer",
    location: "Bangalore, India",
    skills: ["Teaching", "Web Development"]
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    role: "volunteer",
    location: "Mumbai, India",
    skills: ["Marketing", "Event Planning"]
  }
];

const sampleProjects = [
  {
    title: "Beach Cleanup Drive",
    description: "Help us clean the local beaches and protect marine life. Join us every weekend for a meaningful environmental activity.",
    location: "Bangalore, India",
    skills: ["Physical Work", "Environmental Awareness"],
    volunteersNeeded: 20,
    organizationId: "WILL_BE_REPLACED" // Replace with actual org ID after registration
  },
  {
    title: "Teaching Underprivileged Children",
    description: "Teach basic subjects to underprivileged children in our community center. Help make education accessible to all.",
    location: "Bangalore, India",
    skills: ["Teaching", "Communication"],
    volunteersNeeded: 5,
    organizationId: "WILL_BE_REPLACED"
  },
  {
    title: "Food Distribution for Homeless",
    description: "Help us prepare and distribute food to homeless people in the city. Every meal makes a difference.",
    location: "Mumbai, India",
    skills: ["Cooking", "Social Work"],
    volunteersNeeded: 10,
    organizationId: "WILL_BE_REPLACED"
  }
];

console.log("Sample Data for Testing");
console.log("========================\n");

console.log("Sample Users:");
console.log(JSON.stringify(sampleUsers, null, 2));

console.log("\nSample Projects:");
console.log(JSON.stringify(sampleProjects, null, 2));

console.log("\n\nTo create sample data:");
console.log("1. Start backend server: npm run dev");
console.log("2. Use Postman or frontend to register organization");
console.log("3. Use organization ID to create projects");
console.log("4. Register volunteers to test application feature");
