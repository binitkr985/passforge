import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { fetchMarkdown } from "@/lib/utils";

export default async function Page() {
    const markdown = await fetchMarkdown(
        "https://raw.githubusercontent.com/binitkr985/binitkr985.github.io/refs/heads/main/passforge/privacy.md"
    );

    return (
        <main className="min-h-screen bg-neutral-950">
            <section className="mx-auto max-w-4xl px-6 py-14">
                <article className="prose prose-invert prose-policy max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {markdown}
                    </ReactMarkdown>
                </article>
            </section>
        </main>
    );
}
