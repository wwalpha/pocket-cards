//
//  SocietyHomeView.swift
//  PocketCards
//
//  Created by macmini on 2022/03/08.
//

import SwiftUI

struct SocietyHomeView: View {
    private var router: SocietyHomeRouter?

    var body: some View {
        VStack {
            Spacer()
            
            NavigationLink(destination: router?.makeStudyiew()) {
                Text("勉強の取込")
                    .padding()
                    .foregroundColor(Color.white)
                    .font(.largeTitle)
                    .frame(width: 360, alignment: .center)
                    .background(Color.society)
            }.padding(16)
            
            NavigationLink(destination: router?.makeTestView()) {
                Text("日々のテスト")
                    .padding()
                    .foregroundColor(Color.white)
                    .font(.largeTitle)
                    .frame(width: 360, alignment: .center)
                    .background(Color.society)
            }.padding(16)
            
            Spacer()
        }
        .padding()
        .navigationTitle("社会")
    }
}

extension SocietyHomeView {
    func configureView() -> some View {
        var view = self
        let router = SocietyHomeRouter()
        view.router = router
        
        return view
    }
}

struct SocietyHomeView_Previews: PreviewProvider {
    static var previews: some View {
        SocietyHomeView()
    }
}
