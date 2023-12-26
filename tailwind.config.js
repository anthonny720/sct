module.exports = {
    darkMode: 'class',
    content: ["./src/**/*.{js,jsx,ts,tsx,mjs}",],
    theme: {
        extend: {},
    },
    plugins: [
        require('tailwind-scrollbar-hide')
    ],
}
