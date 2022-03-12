//
//  LanguageHomeView.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import SwiftUI

struct LanguageHomeView: View {
    private var router: LanguageHomeRouter?
    
    var body: some View {
        VStack {
            Spacer()

            NavigationLink(destination: router?.makeStudyiew()) {
                Text("勉強の取込")
                    .padding()
                    .foregroundColor(Color.white)
                    .font(.largeTitle)
                    .frame(width: 360, alignment: .center)
                    .background(Color.language)
            }.padding(16)
            
            NavigationLink(destination: router?.makeTestView()) {
                Text("日々のテスト")
                    .padding()
                    .foregroundColor(Color.white)
                    .font(.largeTitle)
                    .frame(width: 360, alignment: .center)
                    .background(Color.language)
            }.padding(16)
            
            Spacer()
        }
        .padding()
        .navigationTitle("国語")
        .navigationBarTitleDisplayMode(.large)
    }
}

extension LanguageHomeView {
    func configureView() -> some View {
        var view = self
        let router = LanguageHomeRouter()
        view.router = router
        
        return view
    }
}

struct LanguageHomeView_Previews: PreviewProvider {
    static var previews: some View {
        LanguageHomeView()
    }
}
