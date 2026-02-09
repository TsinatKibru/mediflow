
import os

brain_dir = "/home/calm/.gemini/antigravity/brain"
for item in os.listdir(brain_dir):
    item_path = os.path.join(brain_dir, item)
    if os.path.isdir(item_path):
        task_path = os.path.join(item_path, "task.md")
        if os.path.exists(task_path):
            try:
                with open(task_path, "r") as f:
                    first_line = f.readline().strip()
                print(f"{item}: {first_line}")
            except Exception as e:
                print(f"{item}: Error reading task.md - {e}")
        else:
            # Check for other md files?
            # print(f"{item}: No task.md")
            pass
