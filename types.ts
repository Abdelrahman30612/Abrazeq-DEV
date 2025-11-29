import React from 'react';

export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  image: string;
  link: string;
}

export interface Skill {
  name: string;
  icon: React.ComponentType<any>;
  level: number;
}

export enum SectionId {
  HERO = 'hero',
  SKILLS = 'skills',
  PROJECTS = 'projects',
  CONTACT = 'contact',
}