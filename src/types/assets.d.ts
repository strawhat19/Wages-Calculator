declare module '*.scss';
declare module '*.png' {
  const image: import('react-native').ImageSourcePropType;
  export default image;
}
