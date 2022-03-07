//
//  RootView.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import SwiftUI

struct RootView: View {
    private var router: RootRouter?
    
    var body: some View {
        VStack {
            HStack {
                // Language button
                NavigationLink(destination: router?.makeLanguageHomeView()) {
                    Text("Language")
                        .padding()
                        .foregroundColor(Color.white)
                        .font(.largeTitle)
                        .frame(width: 200, height: 100, alignment: .center)
                        .background(Color.language)
                }
                
                Spacer()
                
                //                    // Society button
                //                    presenter.linkSocietyHome {
                //                        Text("Society")
                //                            .padding()
                //                            .foregroundColor(Color.white)
                //                            .font(.largeTitle)
                //                            .frame(width: 200, height: 100,alignment: .center)
                //                            .background(Color.blue)
                //
                //                    }
                //
                //                    Spacer()
                //
                //                    presenter.linkScienceHome {
                //                        // Science button
                //                        Text("Science")
                //                            .padding()
                //                            .foregroundColor(Color.white)
                //                            .font(.largeTitle)
                //                            .frame(width: 200, height: 100,alignment: .center)
                //                            .background(Color.blue)
                //                    }
                
            }.padding(.horizontal, 150)
        }.navigationTitle("Home")
    }
}

extension RootView {
    func configureView() -> some View {
        var view = self
        
        view.router = RootRouter()
        
        return view
    }
}


struct RootView_Previews: PreviewProvider {
    static var previews: some View {
        RootView()
    }
}
