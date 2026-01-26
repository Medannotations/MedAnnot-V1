import { Clock, Zap } from "lucide-react";

export function Problem() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Grid 2 colonnes équilibrées */}
          <div className="grid lg:grid-cols-2 gap-12 items-stretch">
            {/* Problem - Colonne de gauche */}
            <div className="relative">
              <div className="bg-white border-2 border-red-100 rounded-3xl p-10 h-full shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-7 h-7 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Sans MedAnnot</h3>
                </div>

                <p className="text-lg text-muted-foreground font-medium mb-6 leading-relaxed">
                  18h00 - Votre journée est finie... ou presque
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-red-50/50 rounded-xl">
                    <span className="text-2xl flex-shrink-0">😫</span>
                    <p className="text-foreground font-medium">2h chaque soir à rattraper vos annotations</p>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-red-50/50 rounded-xl">
                    <span className="text-2xl flex-shrink-0">😰</span>
                    <p className="text-foreground font-medium">Le stress constant d'avoir oublié quelque chose</p>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-red-50/50 rounded-xl">
                    <span className="text-2xl flex-shrink-0">😔</span>
                    <p className="text-foreground font-medium">Votre temps personnel sacrifié pour l'administratif</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Solution - Colonne de droite */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-3xl blur opacity-20"></div>
              <div className="relative bg-white border-2 border-green-200 rounded-3xl p-10 h-full shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Avec MedAnnot</h3>
                </div>

                <p className="text-lg text-foreground font-semibold mb-6 leading-relaxed">
                  18h00 - Vous rentrez l'esprit tranquille 💚
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                    <span className="text-2xl flex-shrink-0">⚡</span>
                    <div>
                      <p className="text-foreground font-bold">2h économisées chaque jour</p>
                      <p className="text-sm text-muted-foreground mt-1">Dictez 2 min, l'IA rédige en 10 secondes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                    <span className="text-2xl flex-shrink-0">😌</span>
                    <div>
                      <p className="text-foreground font-bold">Zéro stress, zéro oubli</p>
                      <p className="text-sm text-muted-foreground mt-1">Tout est automatiquement enregistré et rédigé</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                    <span className="text-2xl flex-shrink-0">🏡</span>
                    <div>
                      <p className="text-foreground font-bold">Vos soirées vous appartiennent</p>
                      <p className="text-sm text-muted-foreground mt-1">Déconnectez, reposez-vous, profitez de votre famille</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
