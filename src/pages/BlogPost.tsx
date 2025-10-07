import { useParams, Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, ArrowLeft, Tag } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";
import { useLanguage } from "@/contexts/LanguageContext";

const BlogPost = () => {
  const { id } = useParams();
  const { language } = useLanguage();
  
  const post = blogPosts.find(p => p.id === id);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const title = language === "en" ? post.title : post.titleTa;
  const content = language === "en" ? post.content : post.contentTa;
  const category = language === "en" ? post.category : post.categoryTa;

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="py-12 bg-gradient-to-br from-muted/50 to-background">
        <div className="container mx-auto px-4">
          <Button asChild variant="ghost" className="mb-6">
            <Link to="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === "en" ? "Back to Blog" : "வலைப்பதிவுக்குத் திரும்பு"}
            </Link>
          </Button>
          
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{post.date}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                  {category}
                </span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              {title}
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto border-2">
            <CardContent className="p-8 md:p-12">
              <div 
                className="prose prose-lg max-w-none
                  prose-headings:text-foreground prose-headings:font-bold
                  prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4
                  prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3
                  prose-h4:text-xl prose-h4:mt-4 prose-h4:mb-2
                  prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
                  prose-ul:text-muted-foreground prose-ul:my-4
                  prose-ol:text-muted-foreground prose-ol:my-4
                  prose-li:my-2
                  prose-strong:text-foreground prose-strong:font-semibold
                  prose-em:text-muted-foreground prose-em:italic"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </CardContent>
          </Card>

          {/* Related Posts / CTA */}
          <div className="max-w-4xl mx-auto mt-12">
            <Card className="bg-gradient-to-br from-primary to-accent text-primary-foreground border-0">
              <CardContent className="p-8 text-center space-y-4">
                <h3 className="text-2xl font-bold">
                  {language === "en" 
                    ? "Ready to Transform Your Health?" 
                    : "உங்கள் ஆரோக்கியத்தை மாற்ற தயாரா?"}
                </h3>
                <p className="text-lg opacity-90">
                  {language === "en"
                    ? "Book a consultation with Dr. Dhivyadhashini for personalized Siddha treatment."
                    : "தனிப்பயனாக்கப்பட்ட சித்த சிகிச்சைக்காக டாக்டர் திவ்யதர்ஷினியுடன் ஆலோசனை பதிவு செய்யுங்கள்."}
                </p>
                <Button asChild size="lg" variant="secondary" className="shadow-lg">
                  <Link to="/book-appointment">
                    {language === "en" ? "Book Consultation" : "ஆலோசனை பதிவு செய்யுங்கள்"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BlogPost;
