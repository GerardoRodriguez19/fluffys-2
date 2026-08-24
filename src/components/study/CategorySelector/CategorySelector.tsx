import { categories } from "@/data";
import { Stack } from "@/components/layout";
import { Chip } from "@/components/ui";
import type { Category } from "@/data";

interface Props {
  value: Category[];
  onChange(categories: Category[]): void;
}

export default function CategorySelector({ value, onChange }: Props) {
  const allSelected = categories.every((category) => value.includes(category));

  function handleClick(category: Category) {
    if (value.includes(category)) {
      onChange(value.filter((item) => item !== category));
      return;
    }

    onChange([...value, category]);
  }

  function handleSelectAll() {
    if (allSelected) {
      onChange([]);

      return;
    }

    onChange([...categories]);
  }

  return (
    <Stack direction="row" gap="sm" wrap>
      <Chip selected={allSelected} onClick={handleSelectAll}>
        Todas
      </Chip>

      {categories.map((category) => (
        <Chip
          key={category}
          selected={value.includes(category)}
          onClick={() => handleClick(category)}
        >
          {category}
        </Chip>
      ))}
    </Stack>
  );
}
