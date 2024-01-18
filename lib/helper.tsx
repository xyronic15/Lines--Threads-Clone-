// formatting text for any newlines or links
export function formatText(text: string) {
  // function checks if the word is a link
  const isUrl = (word: string) => {
    const urlPattern =
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;
    return word.match(urlPattern);
  };

  // function adds the link to the text if it is a link
  const addMarkup = (word: string) => {
    // split the text if newline is found
    if (word.includes("\n")) {
      const words = word.split("\n");
      const formattedWords = words.map((w, i) => addMarkup(w));
      const html = formattedWords.join("<br>");
      return html;
    }
    const linkified = isUrl(word)
      ? `<a class="underline hover:font-medium" href="${word}">${word}</a>`
      : word;
    return linkified;
  };

  const words = text.split(" ");

  const formattedWords = words.map((w, i) => addMarkup(w));
  const html = formattedWords.join(" ");
  //   return (
  //     <p
  //       className="mt-2 text-white whitespace-pre-wrap"
  //       dangerouslySetInnerHTML={{ __html: html }}
  //     />
  //   );
  return html;
}
