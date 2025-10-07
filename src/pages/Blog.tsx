import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const Blog = () => {
  const blogPosts = [
    {
      title: "The Power of Kaya Kalpa: Rejuvenation through Siddha",
      excerpt: "Discover the ancient Siddha practice of Kaya Kalpa and how it can help you achieve vitality, longevity, and mental clarity naturally.",
      date: "March 15, 2025",
      readTime: "5 min read",
      category: "Rejuvenation"
    },
    {
      title: "How Diet Influences Dosha Balance",
      excerpt: "Learn how the food you eat affects your body's natural balance and how Siddha dietary principles can optimize your health.",
      date: "March 10, 2025",
      readTime: "7 min read",
      category: "Nutrition"
    },
    {
      title: "Natural Remedies for Stress & Fatigue",
      excerpt: "Explore time-tested Siddha herbs and practices that help combat modern stress and restore your energy levels naturally.",
      date: "March 5, 2025",
      readTime: "6 min read",
      category: "Wellness"
    },
    {
      title: "Holistic Ways to Improve Sleep Naturally",
      excerpt: "Struggling with sleep? Discover Siddha medicine's approach to restoring healthy sleep patterns without dependency on medications.",
      date: "February 28, 2025",
      readTime: "5 min read",
      category: "Sleep Health"
    },
    {
      title: "Herbs that Boost Immunity",
      excerpt: "A comprehensive guide to powerful Siddha herbs that strengthen your immune system and protect against seasonal illnesses.",
      date: "February 20, 2025",
      readTime: "8 min read",
      category: "Immunity"
    },
    {
      title: "Managing PCOS Through Siddha Medicine",
      excerpt: "Understanding PCOS from a Siddha perspective and how natural treatments can help restore hormonal balance.",
      date: "February 15, 2025",
      readTime: "6 min read",
      category: "Women's Health"
    }
  ];

  return (
    <main className="flex-1">
        {/* Hero */}
        <section className="py-20 bg-gradient-to-br from-muted/50 to-background">
          <div className="container mx-auto px-4 text-center space-y-6 animate-fade-in">
            <h1 className="text-5xl font-bold text-foreground">Puthuyir Wellness Corner</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Stay informed and inspired with our regular updates on Siddha health, lifestyle tips, and rejuvenation insights.
            </p>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <Card key={index} className="border-2 hover:border-primary transition-all hover:shadow-xl group flex flex-col">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                      <span>•</span>
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                    <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium mb-3 w-fit">
                      {post.category}
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                    <Button variant="link" className="p-0 h-auto font-semibold group/btn">
                      Read Article
                      <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 bg-gradient-to-br from-primary to-accent text-primary-foreground">
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-8 text-center space-y-4">
                <h2 className="text-3xl font-bold">Stay Updated</h2>
                <p className="text-lg opacity-90">
                  Subscribe to receive the latest health tips and Siddha wellness insights directly to your inbox
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <Button variant="secondary" size="lg">
                    Subscribe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
  );
};

export default Blog;
