import { Clock, ArrowRight, Zap } from "lucide-react";

export function Problem() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8 items-center">
          {/* Problem */}
          <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-destructive-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Votre quotidien aujourd'hui</h3>
            <p className="text-muted-foreground font-medium">
              Votre journée de travail est terminée, mais pas vraiment...
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive-foreground mt-1.5 flex-shrink-0" />
                <span>Vous rentrez épuisé, mais vous devez encore passer 2h à rattraper les annotations oubliées ou à finir celles pas faites</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive-foreground mt-1.5 flex-shrink-0" />
                <span>Impossible de décompresser et profiter de votre soirée - vous pensez aux notes à rédiger</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive-foreground mt-1.5 flex-shrink-0" />
                <span>Le stress constant d'avoir oublié quelque chose d'important</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive-foreground mt-1.5 flex-shrink-0" />
                <span>Le temps passé à écrire vous vole votre temps personnel et familial</span>
              </li>
            </ul>
          </div>
          
          {/* Arrow */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <ArrowRight className="w-10 h-10 text-primary" />
            </div>
          </div>
          
          {/* Solution */}
          <div className="bg-gradient-to-br from-green-50/50 to-blue-50/50 border-2 border-green-200 rounded-2xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Zap className="w-6 h-6 text-green-700" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Votre nouvelle vie avec MedAnnot</h3>
            <p className="text-muted-foreground font-medium">
              Terminez votre journée sereinement, rentrez l'esprit tranquille.
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600 mt-1.5 flex-shrink-0" />
                <span><strong className="text-foreground">2h économisées chaque jour</strong> - dictez en 2 minutes, l'IA rédige en 10 secondes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600 mt-1.5 flex-shrink-0" />
                <span><strong className="text-foreground">Profitez enfin de vos soirées</strong> - déconnectez complètement et rechargez vos batteries</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600 mt-1.5 flex-shrink-0" />
                <span><strong className="text-foreground">Zéro stress, zéro oubli</strong> - tout est enregistré et rédigé professionnellement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600 mt-1.5 flex-shrink-0" />
                <span><strong className="text-foreground">Copie en 1 clic</strong> dans votre logiciel infirmier habituel</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
