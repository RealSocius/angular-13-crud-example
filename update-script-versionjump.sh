pnpm update --latest
pnpm i -D typescript@5.1

# Update test.ts to make it work -> copied behaviour from ng update
sed -i -e '10,16d;22,27d' src/test.ts
