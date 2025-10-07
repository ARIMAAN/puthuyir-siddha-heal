import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";
import { useLanguage } from "@/contexts/LanguageContext";

const Blog = () => {
  const { language } = useLanguage();

  return (
    <main className="flex-1">
        {/* Hero */}
        <section className="py-20 bg-gradient-to-br from-muted/50 to-background">
          <div className="container mx-auto px-4 text-center space-y-6 animate-fade-in">
            <h1 className="text-5xl font-bold text-foreground">
              {language === "en" ? "Puthuyir Wellness Corner" : "புத்துயிர் ஆரோக்கிய மூலை"}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {language === "en" 
                ? "Stay informed and inspired with our regular updates on Siddha health, lifestyle tips, and rejuvenation insights."
                : "சித்த ஆரோக்கியம், வாழ்க்கை முறை குறிப்புகள் மற்றும் புத்துயிர் நுண்ணறிவுகள் பற்றிய எங்கள் வழக்கமான புதுப்பிப்புகளுடன் தெரிந்து கொள்ளுங்கள் மற்றும் ஊக்கமடையுங்கள்."}
            </p>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => {
                const title = language === "en" ? post.title : post.titleTa;
                const excerpt = language === "en" ? post.excerpt : post.excerptTa;
                const category = language === "en" ? post.category : post.categoryTa;
                
                return (
                  <Card key={post.id} className="border-2 hover:border-primary transition-all hover:shadow-xl group flex flex-col">
                    <CardHeader>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                        <span>•</span>
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime}</span>
                      </div>
                      <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium mb-3 w-fit">
                        {category}
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between">
                      <p className="text-muted-foreground mb-4">{excerpt}</p>
                      <Button asChild variant="link" className="p-0 h-auto font-semibold group/btn w-fit">
                        <Link to={`/blog/${post.id}`}>
                          {language === "en" ? "Read Article" : "கட்டுரையைப் படிக்கவும்"}
                          <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 bg-gradient-to-br from-primary to-accent text-primary-foreground">
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-8 text-center space-y-4">
                <h2 className="text-3xl font-bold">
                  {language === "en" ? "Stay Updated" : "புதுப்பிக்கப்பட்ட நிலையில் இருங்கள்"}
                </h2>
                <p className="text-lg opacity-90">
                  {language === "en"
                    ? "Subscribe to receive the latest health tips and Siddha wellness insights directly to your inbox"
                    : "சமீபத்திய ஆரோக்கிய குறிப்புகள் மற்றும் சித்த ஆரோக்கிய நுண்ணறிவுகளை உங்கள் இன்பாக்ஸில் நேரடியாகப் பெற குழுசேரவும்"}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder={language === "en" ? "Enter your email" : "உங்கள் மின்னஞ்சலை உள்ளிடவும்"}
                    className="flex-1 px-4 py-2 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <Button variant="secondary" size="lg">
                    {language === "en" ? "Subscribe" : "குழுசேர்"}
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
