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
            Spacer()
            
            // Language button
            NavigationLink(destination: router?.makeLanguageHomeView()) {
                Text("Language")
                    .foregroundColor(Color.white)
                    .font(.largeTitle)
                    .frame(width: 360, height: 120, alignment: .center)
                    .background(Color.language)
            }
            .padding(16)

            
            // Society button
            NavigationLink(destination: router?.makeSocietyHomeView()) {
                Text("Society")
                    .padding(32)
                    .foregroundColor(Color.white)
                    .font(.largeTitle)
                    .frame(width: 360, height: 120,alignment: .center)
                    .background(Color.society)
            }
            .padding(16)
            
            NavigationLink(destination: router?.makeScienceHomeView()) {
                // Science button
                Text("Science")
                    .padding(32)
                    .foregroundColor(Color.white)
                    .font(.largeTitle)
                    .frame(width: 360, height: 120,alignment: .center)
                    .background(Color.science)
            }
            .padding(16)

            Spacer()
        }
            .navigationBarTitleDisplayMode(.inline)
//            .navigationBarColor(UIColor(Color.primaryDark), UIColor(Color.white))
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Home")
                        .font(.largeTitle.bold())
                        .accessibilityAddTraits(.isHeader)
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        Auth.signOut()
                    } label: {
                        Text("Sign Out")
                            .frame(width: 120, height: 36, alignment: .center)
//                            .foregroundColor(Color.white)
//                            .background(Color.accent1)
                    }
                }
            }
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
