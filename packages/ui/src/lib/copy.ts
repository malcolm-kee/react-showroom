const copyTextFallback = (textToCopy: string) => {
  const currentActive = document.activeElement;
  const textarea = document.createElement('textarea');
  textarea.value = textToCopy;
  document.body.appendChild(textarea);

  try {
    textarea.focus();
    textarea.select();
    document.execCommand('copy');
  } catch (e) {
    console.info('Copy text fail somehow');
    throw e;
  } finally {
    document.body.removeChild(textarea);
    if (currentActive && currentActive !== document.body) {
      (currentActive as HTMLElement).focus();
    }
  }
};

export const copyText = (textToCopy: string): Promise<void> => {
  if (!navigator.clipboard) {
    try {
      copyTextFallback(textToCopy);
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  return navigator.clipboard.writeText(textToCopy);
};
