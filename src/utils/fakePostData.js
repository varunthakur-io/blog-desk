export const getRandomPostData = () => {
  const randomTitles = [
    'Exploring the Unknown',
    'React vs Vue: A Battle',
    'Mastering JavaScript',
    'Travel Tales from the Himalayas',
    'Why Dark Mode Matters',
  ];

  const randomContents = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque pretium.',
    'This is a deep dive into the differences between React and Vue.',
    'JavaScript is a versatile language used for both frontend and backend.',
    'We ventured through snow-covered peaks and lush green valleys.',
    'Dark mode can reduce eye strain and improve battery efficiency.',
  ];

  const index = Math.floor(Math.random() * randomTitles.length);

  return {
    title: randomTitles[index],
    content: randomContents[index],
  };
};
