
export const createStreamIframe = (within) => (id, destination, style) => {
  const base = document.createElement('iframe');

  base.setAttribute('src', destination);
  base.setAttribute('style', style);
  base.setAttribute('x-id', id);

  within.append(base);

  return base;
};
