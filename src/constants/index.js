import { meta, shopify, starbucks, tesla } from "../assets/images";
import {
    car,
    contact,
    css,
    estate,
    express,
    git,
    github,
    html,
    javascript,
    linkedin,
    mongodb,
    motion,
    mui,
    nextjs,
    nodejs,
    pricewise,
    react,
    redux,
    sass,
    snapgram,
    summiz,
    tailwindcss,
    threads,
    typescript
} from "../assets/icons";

export const skills = [
    {
        imageUrl: css,
        name: "CSS",
        type: "Frontend",
    },
    {
        imageUrl: express,
        name: "Express",
        type: "Backend",
    },
    {
        imageUrl: git,
        name: "Git",
        type: "Version Control",
    },
    {
        imageUrl: github,
        name: "GitHub",
        type: "Version Control",
    },
    {
        imageUrl: html,
        name: "HTML",
        type: "Frontend",
    },
    {
        imageUrl: javascript,
        name: "JavaScript",
        type: "Frontend",
    },
    {
        imageUrl: mongodb,
        name: "MongoDB",
        type: "Database",
    },
    {
        imageUrl: motion,
        name: "Motion",
        type: "Animation",
    },
    {
        imageUrl: mui,
        name: "Material-UI",
        type: "Frontend",
    },
    {
        imageUrl: nextjs,
        name: "Next.js",
        type: "Frontend",
    },
    {
        imageUrl: nodejs,
        name: "Node.js",
        type: "Backend",
    },
    {
        imageUrl: react,
        name: "React",
        type: "Frontend",
    },
    {
        imageUrl: redux,
        name: "Redux",
        type: "State Management",
    },
    {
        imageUrl: sass,
        name: "Sass",
        type: "Frontend",
    },
    {
        imageUrl: tailwindcss,
        name: "Tailwind CSS",
        type: "Frontend",
    },
    {
        imageUrl: typescript,
        name: "TypeScript",
        type: "Frontend",
    }
];

export const experiences = [
    {
        title: "Weekly Maths Puzzle ",
        
        date: "Representatives responsible: ",
        iconBg: "#accbe1",
       
        points: [
            "We every week will be giving a Maths Puzzle for classes 5th - 10th ",
            "These will be based on the current sylabus that is being covered in the class.",
            "With this we aim to get more students interested in the field of Mathematics by giving interactive puzzles"

        ],
    },
    {
        title: "Weekly Science Puzzle",
        date: "Representatives responsible: ",
        
        iconBg: "#fbc3bc",
       
        points: [
            "Weekly science puzzles for classes 5th to 10th, based on the current syllabus.",
            "Aimed at making science more engaging through interactive challenges.",
            "Encourages critical thinking and curiosity in the field of science.",
            
        ],
    },
    {
        title: "Bi-Weekly Art Prompt Competition",
        
        date: "Jan 2022 - Jan 2023",
        points: [
            "Bi-weekly art prompts for classes 5th to 10th, aligned with class themes.",
            "Designed to spark creativity and artistic expression.",
            "Promotes appreciation for visual arts through fun and competitive activities.",
        ],
    },
    
];

export const socialLinks = [
    {
        name: 'Contact',
        iconUrl: contact,
        link: '/contact',
    },
    {
        name: 'GitHub',
        iconUrl: github,
        link: 'https://github.com/YourGitHubUsername',
    },
    {
        name: 'LinkedIn',
        iconUrl: linkedin,
        link: 'https://www.linkedin.com/in/YourLinkedInUsername',
    }
];

export const projects = [
    {
        iconUrl: pricewise,
        theme: 'btn-back-red',
        name: 'Helium Balloon based CubeSAT',
        description: 'We in the future are planning to conduct a schoolwide activity where we will build a CubeSAT and launch it into NearSpace through a helium baloon',
        link: 'https://www.nasa.gov/what-are-smallsats-and-cubesats/#:~:text=What%20are%20CubeSats%3F,%2C%206%2C%20and%20even%2012U.',
    },
    {
        iconUrl: threads,
        theme: 'btn-back-green',
        name: 'Robotics competitions.',
        description: 'We want to conduct various robotics Competitions in the school. Learn More:',
        link: 'https://docs.google.com/document/d/1S_L9qfaAMdfp-x6BPb442lGH5xbr7WzaI-GJTCf7YIs/edit?usp=sharing',
    },
    {
        iconUrl: car,
        theme: 'btn-back-blue',
        name: 'Creating Applications in Python',
        description: 'We will be creating applications using streamlit, flask and Turtle',
        link: 'https://streamlit.io/',
    }
];