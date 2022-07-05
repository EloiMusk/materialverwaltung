git branch -r | grep -v '\->' > /tmp/branches.txt
find . -type d -print | sed 's/\.\///g' > /tmp/dirs.txt
comm -23 /tmp/branches.txt /tmp/dirs.txt > /tmp/unused.txt
while read line; do
  echo "Removing $line"
  rm -rf $line
done < /tmp/unused.txt
rm /tmp/branches.txt /tmp/dirs.txt /tmp/unused.txt
ls