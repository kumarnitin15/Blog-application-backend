module.exports = {
    firstUpper: str => {
        const lower = str.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
      },
    
      lowerCase: str => {
        return str.toLowerCase();
      }
}