import { Heart, Target, Users, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-primary/5 py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-6">عن الجمعية</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            نحن جزء من مؤسسة صناع الحياة مصر، نعمل كفريق تطوعي في محافظة بني سويف لنشر الخير وتنمية المجتمع وتمكين الشباب من خلال برامج ومشروعات تنموية مستدامة ومؤثرة.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">رؤيتنا</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              نموذج رائد للعمل التطوعي والتنموي في مصر والعالم العربي، يعمل على بناء إنسان منتج ومجتمع متعاون.
            </p>
            <h2 className="text-3xl font-bold pt-4">رسالتنا</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              تمكين الشباب والمتطوعين من تنمية مجتمعاتهم من خلال مشروعات ومبادرات تسد الاحتياجات الأساسية وترتقي بالإنسان في كافة الجوانب التعليمية والصحية والمعيشية.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 bg-primary/10 rounded-2xl text-center space-y-4">
              <div className="bg-primary/20 w-16 h-16 mx-auto rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-xl">العطاء</h3>
            </div>
            <div className="p-6 bg-primary/10 rounded-2xl text-center space-y-4 mt-8">
              <div className="bg-primary/20 w-16 h-16 mx-auto rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-xl">التعاون</h3>
            </div>
            <div className="p-6 bg-primary/10 rounded-2xl text-center space-y-4 -mt-8">
              <div className="bg-primary/20 w-16 h-16 mx-auto rounded-full flex items-center justify-center">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-xl">التأثير</h3>
            </div>
            <div className="p-6 bg-primary/10 rounded-2xl text-center space-y-4">
              <div className="bg-primary/20 w-16 h-16 mx-auto rounded-full flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-xl">الشفافية</h3>
            </div>
          </div>
        </div>
      </section>

      {/* History and Impact Section */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">تاريخنا وأثرنا</h2>
            <div className="h-1.5 w-16 bg-primary rounded-full mx-auto" />
            <p className="text-lg text-muted-foreground leading-relaxed">
              تأسست جمعية صناع الحياة كحركة شبابية تطوعية استجابةً لنداءات التنمية في المجتمع المصري. في محافظة بني سويف، انطلقنا لنكون الذراع الميداني القوي الذي يصل للقرى والنجوع، ويعمل جنباً إلى جنب مع الفئات الأولى بالرعاية لتمكينهم وتخفيف العبء عنهم وتطوير قدراتهم.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-8 text-center pt-8 border-t border-border/50">
            <div>
              <div className="text-5xl font-extrabold text-primary mb-2">+20</div>
              <div className="text-xl font-medium text-foreground/80">عاماً من العطاء</div>
            </div>
            <div>
              <div className="text-5xl font-extrabold text-primary mb-2">12</div>
              <div className="text-xl font-medium text-foreground/80">مركز وقرية مخدومة</div>
            </div>
            <div>
              <div className="text-5xl font-extrabold text-primary mb-2">+100K</div>
              <div className="text-xl font-medium text-foreground/80">مستفيد على مدار السنوات</div>
            </div>
          </div>
        </div>
      </section>

      {/* Organizational Structure / Committees */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">الهيكل واللجان التنفيذية</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              نعتمد في عملنا على هيكل تنظيمي مرن يعزز من طاقات الشباب ويوجهها نحو التخصص والاحترافية.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "لجنة الأبحاث الميدانية",
                desc: "المسؤولة عن النزول للقرى ودراسة الحالات دراسة وافية للتأكد من استحقاقها للدعم وتحديد نوع التدخل المطلوب."
              },
              {
                title: "لجنة المشروعات والتنفيذ",
                desc: "تتولى إدارة وتنفيذ القوافل والمشروعات الصغيرة (رزق حلال) ومتابعة مراحل التنفيذ والتوريد."
              },
              {
                title: "لجنة الموارد البشرية (HR)",
                desc: "معنية باستقطاب المتطوعين الجدد، تدريبهم، تقييم أدائهم، ودمجهم في اللجان المختلفة."
              },
              {
                title: "لجنة العلاقات العامة والتسويق",
                desc: "إدارة الصورة الذهنية للمؤسسة، التواصل مع الجهات المانحة والرعاة، وتغطية الفعاليات إعلامياً."
              },
              {
                title: "القطاع الطبي",
                desc: "أطباء وصيادلة متطوعون لتقديم الخدمات الاستشارية الطبية، تجهيز القوافل الدوائية، وتيسير الإجراءات الجراحية."
              },
              {
                title: "اللجنة المالية",
                desc: "مراقبة وضبط التدفقات النقدية والتبرعات، وإصدار التقارير للمتطوعين لضمان أعلى درجات الشفافية."
              }
            ].map((committee, idx) => (
              <div key={idx} className="bg-muted/10 p-8 rounded-2xl border border-border/50 hover:border-primary/30 transition-colors shadow-sm hover:shadow-md">
                <h3 className="text-xl font-bold mb-3 text-primary">{committee.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{committee.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
