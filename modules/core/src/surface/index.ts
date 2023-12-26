const init = () => {
  return {
    ui: {
      hello: () => "world",
    },
  } as const;
};

export { init };
