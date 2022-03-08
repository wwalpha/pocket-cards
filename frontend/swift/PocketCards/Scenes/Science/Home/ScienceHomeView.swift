//
//  ScienceHomeView.swift
//  PocketCards
//
//  Created by macmini on 2022/03/08.
//

import SwiftUI

struct ScienceHomeView: View {
    private var router: ScienceHomeRouter?
    
    var body: some View {
        VStack {
            Spacer()

            NavigationLink(destination: router?.makeStudyiew()) {
                Text("勉強の取込")
                    .padding()
                    .foregroundColor(Color.white)
                    .font(.largeTitle)
                    .frame(width: 360, alignment: .center)
                    .background(Color.science)
            }.padding(16)
            
            NavigationLink(destination: router?.makeStudyiew()) {
                Text("日々のテスト")
                    .padding()
                    .foregroundColor(Color.white)
                    .font(.largeTitle)
                    .frame(width: 360, alignment: .center)
                    .background(Color.science)
            }.padding(16)
            
            Spacer()
        }
        .padding()
        .navigationTitle("理科")
    }
}

extension ScienceHomeView {
    func configureView() -> some View {
        var view = self
        let router = ScienceHomeRouter()
        view.router = router
        
        return view
    }
}

struct ScienceHomeView_Previews: PreviewProvider {
    static var previews: some View {
        ScienceHomeView()
    }
}
