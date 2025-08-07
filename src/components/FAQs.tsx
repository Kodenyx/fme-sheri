
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQs = () => {
  const faqs = [
    {
      question: "What does FixMyEmail actually do - and what kind of emails is it built for?",
      answer: "FixMyEmail is a conversion copy tool that rewrites your emails using behavioral psychology, buyer decision patterns, and proven sales frameworks - so more people take action. It's not built for brand storytelling, voice matching, or long-form nurture. It's engineered for clarity, urgency, and persuasion. The tool is best used for: Cold outreach, Re-engagement emails, Promotional emails, and Conversion-driven messages like booking a call or pushing to a demo. If your email has a clear call to action - and you want more people to take it - FixMyEmail is built for that.",
    },
    {
      question: "How is this different from ChatGPT, Jasper, or Grammarly?",
      answer: "Most tools focus on polish. FixMyEmail focuses on persuasion. Grammarly improves grammar. Jasper writes long-form content. ChatGPT can help with general drafting - but it's not trained to optimize for conversions unless you already know what to prompt for. FixMyEmail is different. It's built specifically to rewrite B2B emails using proven conversion frameworks, sales psychology, and decision science. It sharpens your message so the right people take action - without you needing to know what to ask or how to phrase it. It's fast, focused, and engineered to turn hesitation into clicks and replies.",
    },
    {
      question: "Will this sound like me or rewrite my brand voice?",
      answer: "FixMyEmail prioritizes clarity and conversion - not brand voice replication. The tool rewrites your email to improve structure, flow, and persuasion. It may sound more direct or concise than your usual tone - and that's intentional. It's designed to reduce friction, sharpen your CTA, and make your message easier to act on. That said, the output is meant to be a strategic draft. You can easily tweak the tone to sound more like you while keeping the structure that drives results. Think of it as a smart second pass - not a final say.",
    },
    {
      question: "Is this a good fit for storytelling or nurture emails?",
      answer: "FixMyEmail is not designed for storytelling, branding, or long-form nurture. If you're writing a welcome series or a personal founder story, this tool might feel too focused on action - and that's by design. It's built to tighten persuasive emails with a clear goal: get the right person to take the next step. That said, if you've already written a story-based email and want to sharpen the CTA or improve clarity, FixMyEmail can help you refine it - especially in the closing or transition lines. Use it where momentum matters.",
    },
    {
      question: "Do I need to start from scratch or can I use this on emails I already wrote?",
      answer: "FixMyEmail works best when you start with a draft - especially one you've written but aren't fully confident in. You don't need to scrap what you have. Just paste your existing email into the tool, and it will rewrite it for stronger clarity, persuasion, and flow. Even high-performing emails can benefit from a second pass that tightens the CTA or improves the hook. Think of it as a fast optimization layer - one that helps good emails become great.",
    },
    {
      question: "Can I use this on client campaigns or team-written drafts?",
      answer: "Yes. FixMyEmail is a powerful review tool for any email - whether you wrote it, your teammate did, or it came from a client. If you work on campaigns with multiple contributors, the tool can help align the message around one clear action. It's especially useful for improving drafts that feel cluttered, too soft, or unclear. Use it as a quick quality check before sending or presenting final copy. It's like having a conversion strategist in your back pocket - without slowing down your workflow.",
    },
    {
      question: "How does FixMyEmail know what to change and can I trust the rewrite to perform better?",
      answer: "FixMyEmail is built on proven conversion frameworks, behavioral science, and real buyer psychology - so every rewrite is based on how people actually make decisions. It was created by Sheri Otto, former demand lead at HubSpot and a top-ranked sales trainer by Sales.io. The tool applies the same sales and messaging principles Sheri used to support high-growth teams, now distilled into a fast, AI-powered rewrite engine. It identifies friction points, weak hooks, vague CTAs, and buried value, and replaces them with structure and flow designed to prompt action. While no tool can guarantee results, FixMyEmail is engineered to give you a version that's clearer, tighter, and more likely to convert.",
    },
    {
      question: "What if the rewrite doesn't feel right or something important is missing?",
      answer: "That can happen - and it's okay. FixMyEmail is built to strengthen the strategy of your message, not replace your voice or judgment. If something feels off, think of the rewrite as a starting point, not a final draft. You can pull lines from both versions. You can add back details the tool removed. Or you can keep your original tone while using the output's structure to tighten and guide the flow. It's not about perfection. It's about progress toward a version that gets replies.",
    },
    {
      question: "How do I know if it's working and why should I keep using it?",
      answer: "The best sign it's working? More replies, clicks, and increases in B2B conversion metrics like book demos and sales calls. But even before growth results roll in, you'll notice signals: your message is easier to read, the CTA is sharper, and there's less hesitation in how it flows. FixMyEmail helps you spot and fix the small gaps that stall momentum. The more you use it, the more you'll build the skill of seeing what makes an email convert - and that's a habit worth keeping. And when it does work, share your wins and tag @SheriOtto - we'd love to feature you.",
    },
  ];

  return (
    <section className="py-16 px-4 md:px-8 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline text-left">
                <span className="font-semibold text-gray-800">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-gray-700 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQs;
