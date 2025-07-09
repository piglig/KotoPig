# -*- coding: utf-8 -*-

import os
import google.generativeai as genai
from dotenv import load_dotenv

# --- 配置 ---
# 自动从 .env 文件加载环境变量
load_dotenv()

# 从环境中获取 API 密钥（现在它可能来自 .env 文件）
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("请在 .env 文件中或环境变量中设置 GOOGLE_API_KEY")

genai.configure(api_key=api_key)

# 选择要使用的模型
MODEL_NAME = "gemini-2.5-flash" # 您可以根据需要更改为 gemini-2.5-pro 等

# --- Agent 提示词定义 ---

CODER_PROMPT_TEMPLATE = """
你是一个专业的 Python 程序员 (Coder)。
你的任务是根据以下需求，编写出高质量、功能完整的 Python 代码。
请确保代码逻辑清晰、有适当的注释。

需求：
---
{requirement}
---

请直接输出代码，不要包含任何额外的解释或对话。
"""

REVIEWER_PROMPT_TEMPLATE = """
你是一个资深的代码审查员 (Reviewer)。
你的任务是审查以下 Python 代码，并从以下几个方面提出清晰、具体的优化建议：
1.  **代码风格**: 是否符合 PEP 8 规范？
2.  **可读性**: 变量和函数命名是否清晰？逻辑是否易于理解？
3.  **性能**: 是否有明显的性能瓶颈？有没有更高效的实现方式？
4.  **健壮性**: 是否有潜在的错误或边界情况没有处理？

请不要修改代码，只提供你的审查建议。以列表形式输出。

待审查的代码：
---
{code}
---
"""

FINALIZER_PROMPT_TEMPLATE = """
你是一个顶级的软件架构师 (Finalizer)。
你的任务是根据【原始代码】和【审查建议】，编写出最终版本的代码。
最终代码应该：
1.  完全实现原始需求。
2.  吸收所有合理的审查建议。
3.  成为一个生产级别的、高质量的代码范例。

原始需求：
---
{requirement}
---

原始代码：
---
{code}
---

审查建议：
---
{review}
---

请直接输出最终的代码，不要包含任何额外的解释或对话。
"""

def run_code_pipeline(requirement: str, output_file: str = "code_pipeline_output.txt"):
    """
    运行三步代码生成流程，并将所有输出写入文件。
    
    Args:
        requirement: 用户的编程需求。
        output_file: 保存输出的UTF-8编码文件名。
    """
    # 这个print语句只包含ASCII字符，可以安全地在任何终端上显示
    print(f"Script is running... Please check the output file when complete: {output_file}")
    try:
        with open(output_file, "w", encoding="utf-8") as f:
            model = genai.GenerativeModel(MODEL_NAME)
            
            f.write("="*50 + "\n")
            f.write(f"任务开始：{requirement}\n")
            f.write("="*50 + "\n\n")

            # --- 第 1 步：编码 ---
            f.write("[第一步] 编码 Agent 正在生成初始代码...\n")
            coder_prompt = CODER_PROMPT_TEMPLATE.format(requirement=requirement)
            initial_code_response = model.generate_content(coder_prompt)
            initial_code = initial_code_response.text
            f.write("初始代码生成完毕！\n")
            f.write("-" * 20 + " 初始代码 " + "-" * 20 + "\n")
            f.write(initial_code + "\n")
            f.write("-" * 50 + "\n\n")

            # --- 第 2 步：审查 ---
            f.write("[第二步] 审查 Agent 正在分析代码并提供建议...\n")
            reviewer_prompt = REVIEWER_PROMPT_TEMPLATE.format(code=initial_code)
            review_response = model.generate_content(reviewer_prompt)
            review = review_response.text
            f.write("审查建议已生成！\n")
            f.write("-" * 20 + " 审查建议 " + "-" * 20 + "\n")
            f.write(review + "\n")
            f.write("-" * 50 + "\n\n")

            # --- 第 3 步：定稿 ---
            f.write("[第三步] 终稿 Agent 正在结合建议编写最终代码...\n")
            finalizer_prompt = FINALIZER_PROMPT_TEMPLATE.format(
                requirement=requirement,
                code=initial_code,
                review=review
            )
            final_code_response = model.generate_content(finalizer_prompt)
            final_code = final_code_response.text
            f.write("最终代码已生成！\n")
            f.write("-" * 20 + " 最终代码 " + "-" * 20 + "\n")
            f.write(final_code + "\n")
            f.write("-" * 50 + "\n\n")
            
            f.write("\n任务完成！\n")
        
        print(f"Success! All output has been saved to {output_file}")

    except Exception as e:
        error_message = f"发生错误: {e}\n请检查您的 Google AI API 密钥是否正确设置，以及网络连接是否正常。\n"
        # 同样，只打印安全的ASCII字符
        print("An error occurred. Check the output file for details.")
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(error_message)

if __name__ == "__main__":
    # --- 在这里定义你的编程需求 ---
    user_requirement = "编写一个 Python 函数，该函数接收一个整数列表，并返回一个新的列表，其中只包含所有大于 10 的偶数。"
    
    run_code_pipeline(user_requirement)
